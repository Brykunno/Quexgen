from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat, DocumentSchema, FunctionToolDefinition, ToolDefinition, ToolParameters
from rest_framework import status
import random
import re
import pdfplumber
import io
import traceback 
import time
import difflib
import sys




api_key = "f197bb64-d6d1-42f9-b5f5-a2278bf08c9d"
client = AI21Client(api_key=api_key)

# Token limit for the Jamba model (rough estimate of word-to-token ratio)
max_tokens = 1024


# Split the context into paragraphs
# def split_context_into_paragraphs(context,extracted_lines):
#     lines = context.split('\n')
#     paragraphs = ['\n'.join(lines[i:i+extracted_lines]) for i in range(0, len(lines), extracted_lines)]
#     return paragraphs

SUBSTITUTIONS = {
    # Dashes & Hyphens
    "\u2010": "-",   # hyphen
    "\u2011": "-",   # non-breaking hyphen
    "\u2012": "-",   # figure dash
    "\u2013": "-",   # en dash
    "\u2014": "-",   # em dash
    "\u2015": "-",   # horizontal bar

    # Quotes
    "\u2018": "'",   # left single quote
    "\u2019": "'",   # right single quote / apostrophe
    "\u201A": ",",   # single low-9 quote
    "\u201B": "'",   # single high-reversed-9 quote
    "\u201C": '"',   # left double quote
    "\u201D": '"',   # right double quote
    "\u201E": '"',   # double low-9 quote
    "\u201F": '"',   # double high-reversed-9 quote

    # Ellipsis
    "\u2026": "...", # ellipsis

    # Spaces
    "\u00A0": " ",   # non-breaking space
    "\u2000": " ", "\u2001": " ", "\u2002": " ",
    "\u2003": " ", "\u2004": " ", "\u2005": " ",
    "\u2006": " ", "\u2007": " ", "\u2008": " ",
    "\u2009": " ", "\u200A": " ", # various thin spaces
    "\u202F": " ",   # narrow no-break space
    "\u205F": " ",   # medium math space
    "\u3000": " ",   # ideographic space

    # Bullets & similar
    "\u2022": "*",   # bullet
    "\u2023": ">",   # triangular bullet
    "\u25E6": "*",   # white bullet
    "\u2043": "-",   # hyphen bullet
    "\u2219": "*",   # bullet operator
    "\u2756": "*",   # black diamond with white diamond
    "\u2767": "*",   # floral heart

    # Arrows
    "\u2190": "<-",  # left arrow
    "\u2192": "->",  # right arrow
    "\u2191": "^",   # up arrow
    "\u2193": "v",   # down arrow
    "\u21D2": "=>",  # double arrow right
    "\u21D0": "<=",  # double arrow left
    "\u21D4": "<=>", # double arrow both

    # Math symbols
    "\u00D7": "x",   # multiplication
    "\u00F7": "/",   # division
    "\u2260": "!=",  # not equal
    "\u2264": "<=",  # less than or equal
    "\u2265": ">=",  # greater than or equal
    "\u221E": "inf", # infinity
}


def safe_unicode(text):
    if text is None:
        return ""
    if isinstance(text, bytes):
        text = text.decode("utf-8", errors="replace")
    else:
        text = str(text)

    # Apply custom substitutions
    for bad, sub in SUBSTITUTIONS.items():
        text = text.replace(bad, sub)

    # Replace all non-ASCII characters with "-"
    text = ''.join(ch if ord(ch) < 128 else '-' for ch in text)

    return text

def split_context_into_paragraphs(context,extracted_lines):
    lines = context.split('\n')
    paragraphs = ['\n'.join(lines[i:i+extracted_lines]) for i in range(0, len(lines), extracted_lines)]
    return paragraphs

# Number of questions to generate
num_questions = 10

# Define the context
context = (
    "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
)

# Bloom's Taxonomy levels
taxonomy_levels = {
    "Remembering": "Recall or recognize essential facts, concepts, or principles from memory without needing to interpret or analyze them. This includes tasks like listing important historical events, reciting formulas, or naming the components of a system.",
    
    "Understanding": "Grasp the meaning of information and express it clearly in different forms, such as summarizing main ideas, explaining concepts in your own words, or classifying different types of phenomena. This level includes describing how something works or explaining the significance of an idea.",
    
    "Applying": "Put learned knowledge into practice in new or familiar situations, demonstrating the ability to execute a concept effectively. This involves solving problems using known strategies, conducting a procedure in a lab, or using principles to develop a project or craft an argument.",
    
    "Analyzing": "Examine and break information into parts to understand its structure, relationships, or causes. This might involve differentiating between elements, organizing data to highlight patterns, or making inferences about how parts contribute to the whole. It includes exploring assumptions behind an argument or discovering hidden connections between concepts.",
    
    "Evaluating": "Make informed judgments by critiquing ideas, theories, or solutions based on criteria or standards. This involves defending opinions with evidence, debating the merits of various options, or assessing the validity of conclusions. You may be tasked with making decisions in complex scenarios or offering thoughtful recommendations.",
    
    "Creating": "Formulate original ideas, products, or systems by integrating diverse elements in a unique way. This requires using creativity to construct solutions, propose new theories, or design something novel. Examples include inventing a new device, developing a business plan, or composing a piece of writing that demonstrates innovation and depth."
}



iden_taxonomy_levels = {
    "Remembering": "Identify and recall basic facts and concepts.",
    "Understanding": "Identify and explain ideas or concepts.",
    "Applying": "Identify how to use information in new situations.",
    "Analyzing": "Identify patterns and connections among ideas.",
    "Evaluating": "Identify and justify a decision or course of action.",
    "Creating": "Identify components to generate new ideas or products."
}



# Define prompts for each taxonomy level
prompts = {
    "Remembering": (
        "Develop a thought-provoking multiple-choice question aligned with the 'Remembering' level of Bloom's taxonomy. Aim for questions that require recalling or identifying specific details, yet in a fresh and engaging way. For example, challenge learners to recognize details from the provided context: {context} in a unique format. Ensure questions prompt learners to remember key points, terminology, or data with a twist—consider trivia-style or association-based prompts."
        "The question must be written immediately, without any introductory phrases, explanations, or prefaces (e.g., do NOT start with “The executive summary is designed to:” or similar)."
        "Avoid questions that rely solely on plain repetition, such as 'What is the primary...' or 'What is the purpose...'."
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on different facts, concepts, or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Understanding": (
        "Craft a multiple-choice question that aligns with the 'Understanding' level of Bloom's taxonomy. Make the question not only ask for explanations but also apply comparisons, summaries, or interpretations that could spark curiosity: {context}."
        "The question must be written immediately, without any introductory phrases, explanations, or prefaces (e.g., do NOT start with “The executive summary is designed to:” or similar)."
        "Avoid generic phrasing like 'What is the purpose...' and instead aim for questions that require comprehension in an engaging way, such as rephrasing or contextual examples."
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on different aspects, explanations, or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Applying": (
        "Create an applying multiple-choice question based on Bloom's taxonomy that requires applying the following context to a new situation: {context}. "
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on a unique application scenario or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Analyzing": (
        "Formulate an analysis-based multiple-choice question that aligns with the 'Analyzing' level of Bloom's taxonomy. Encourage deeper thought, such as finding causes, comparing elements, or identifying patterns within the context: {context}."
        "The question must be written immediately, without any introductory phrases, explanations, or prefaces (e.g., do NOT start with “The executive summary is designed to:” or similar)."
        "Use analytical tasks, like distinguishing between correct and incorrect assumptions or deconstructing arguments. Steer away from asking simple, purpose-driven questions."
        "List five possible answers, ensuring the correct answer is followed by credible distractors, and keep options label-free and in plain text."
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on a unique analysis or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Evaluating": (
        "Create an evaluating multiple-choice question based on Bloom's taxonomy that requires making a judgment based on the following context: {context}. "
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on a unique evaluation aspect or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Creating": (
        "Create a creating multiple-choice question based on Bloom's taxonomy that involves generating new ideas based on the following context: {context}. "
        "Do not create questions that rely on or reference figures, images, diagrams, or any visual elements. "
        "Ensure the question is distinct from previous questions by focusing on a unique creative idea or wording, avoiding similarities with previously generated questions. "
        "Provide a question followed by five answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    )
}



identification_prompt = {
    "Remembering": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Remembering level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    ),
    "Understanding": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Understanding level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    ),
    "Applying": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Applying level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    ),
    "Analyzing": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Analyzing level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    ),
    "Evaluating": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Evaluating level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    ),
    "Creating": (
        "Create an identification question that aligns with Bloom's Taxonomy at the Creating level using the following context: {context}. "
        "The question and answer must be derived solely from the context provided, avoiding any references to figures, images, or visual elements. "
        "The answer must be a single terminology (a word or a short phrase) rather than a complete sentence. "
        "Provide a question followed by five answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question directly, without any introductory words."
    )
}



torf_prompts =  {
    "Remembering": (
        "Create a True or False question that aligns with the remembering level of Bloom's Taxonomy based on the following context: {}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true fifty percent and false fifty percent."
        "Don't use any introductory words or phrase."
        "Make sure the answer is accurate for the question"
    ),
    "Understanding": (
        "Create a True or False question that aligns with the understanding level of Bloom's Taxonomy based on the following context: {}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true fifty percent and false fifty percent."
        "Don't use any introductory words or phrase."
        "Make sure the answer is accurate for the question"
    ),
    "Applying": (
        "Create a problem or task that aligns with the applying level of Bloom's Taxonomy based on the given context: {}. "
        "Don't use any introductory words or phrase."
        "Make it short and direct."
        "Don't use any introductory words or phrase."

    ),
    "Analyzing": (
        "Create a True or False question that aligns with the analyzing level of Bloom's Taxonomy based on the following context: {}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
          "Make the chance of being a true fifty percent and false fifty percent."
        "Don't use any introductory words or phrase."
        "Make sure the answer is accurate for the question"
    ),
    "Evaluating": (
        "Create a True or False question that aligns with the evaluating level of Bloom's Taxonomy based on the following context: {}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true fifty percent and false fifty percent."
        "Don't use any introductory words or phrase."
        "Make sure the answer is accurate for the question"
    ),
    "Creating": (
        "Create a problem or task that aligns with the creating level of Bloom's Taxonomy based on the given context: {}. "
        "Don't use any introductory words or phrase."
        "Make it short and direct."
        "Don't use any introductory words or phrase."
    )
}

def generate_question_ai(level, context_ques, index, test_type, max_retries=5):
    
  
    # Select the appropriate prompt based on test type
    if test_type == "trueOrFalse":
        prompt = torf_prompts[level].format(context=context_ques)
    else :
        prompt = prompts[level].format(context=context_ques)
        
    
    retry_count = 0

    while retry_count < max_retries:
        try:
            response = client.chat.completions.create(
                model="jamba-large-1.7",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                documents=[],
                tools=[],
                n=1,
                max_tokens=1024,
                temperature=0.4,
                top_p=1,
                stop=[],
                response_format=ResponseFormat(type="text")
            )
            
            
            raw_content = response.choices[0].message.content.strip()
            # Access the response content
            choice = response.choices[0]  # Accessing the first choice
            message = choice.message  # Accessing the message
            content = message.content  # Accessing the content of the message

            # Process the content to remove any numbers, letters, or asterisks from the answer options
            lines = [re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip()) for line in content.strip().split('\n')]

            # Ensure there are enough lines for MCQ, retry if incomplete
            if len(lines) < 5 and test_type != "trueOrFalse":
                retry_count += 1
                continue
            
            question = lines[0]  # First line is the question
            
            if test_type == "mcq":
                correct_answer = lines[2]  # First option is the correct answer
                choices = lines[2:]  # All five options including the correct answer
                choices = [re.sub(r'^\w+\)\s*', '', choice.replace('*', '').strip()) for choice in choices]  # Clean choices
                
           

                random.shuffle(choices)  # Randomize choice order

                letters = ['A', 'B', 'C', 'D']
                choice_dict = [choices[i] for i in range(len(choices))]
                
                # Determine the letter for the correct answer based on its content after cleaning
                correct_answer_letter = next(letter for letter, choice in zip(letters, choice_dict) if choice == correct_answer.strip())

                question_dict = {
                    "question": question,
                    "correct_answer": correct_answer,
                    "choices": choice_dict,  # Use the dictionary that maps letters to choices
                    "index": index,
                    "answer": correct_answer_letter
                }

            elif test_type == "identification":
                correct_answer = lines[2]  # The answer to be identified
                correct_answer = correct_answer.replace('*', '').strip()

                question_dict = {
                    "question": question,
                    "correct_answer": correct_answer,
                    "choices": [correct_answer],
                    "index": index,
                    "answer": "A"  # Since there is only one choice, it gets "A"
                }

            elif test_type == "trueOrFalse":
                tof_raw_content = response.choices[0].message.content
                print("Raw Output Content:")
                print(tof_raw_content)

                # Extract the statement and answer
                tof_lines = tof_raw_content.strip().split('\n')
                if tof_lines:
                # Clean and format the output
                    statement_with_answer = tof_lines[0].strip()

                # Remove any extra "True" or "False" at the end of the statement, including punctuation
                    statement_with_answer = re.sub(r'\s*[\.\*\_\-\—]*\b(True|False)\b[\.\*\_\-\—]*$', '', statement_with_answer).strip()

                # Determine the correct True/False answer based on the content
                    if "true" in tof_raw_content.lower():
                        true_false = "True"
                    else:
                        true_false = "False"

                # Ensure the statement is not empty or just "True"/"False"
                    if statement_with_answer and statement_with_answer.lower() not in ["true", "false"]:
                    # Create a dictionary to store the cleaned statement and the True/False answer

                        question_dict = {
                        "question": statement_with_answer,
                        "answer": true_false,
                        "index": index,
                        }

            return question_dict

        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                return {"error": f"Failed to generate a valid question after {max_retries} attempts: {str(e)}"}

    return {"error": "Failed to generate a valid question after multiple attempts."}

def generate_question_module(level, context_paragraph,test_type,extracted):
    
    print('context: ', context_paragraph)
    
    # Choose prompt based on taxonomy level
    
    if test_type =='trueOrFalse':
        prompt = torf_prompts[level].format(extracted)
    elif test_type =='identification':
         if level in ["Remembering", "Understanding", "Analyzing"]:
            prompt = identification_prompt[level].format(context=context_paragraph)  # Format the prompt with the context
         elif level in ["Applying", "Evaluating", "Creating"]:
            prompt = f"Create a problem or question that requires {taxonomy_levels[level]} based on the following context: {context_paragraph}. Output the question immediately without any introductory words."
        
    else:
        if level in ["Remembering", "Understanding", "Analyzing"]:
            prompt = prompts[level].format(context=context_paragraph)  # Format the prompt with the context
        elif level in ["Applying", "Evaluating", "Creating"]:
            prompt = f"Generate a question for a subjective test that requires {taxonomy_levels[level]}-level thinking, based on the following context: {context_paragraph}. Output only the question—do not include any labels or introductory text like 'Question:' or similar."


    retries = 0
    max_retries = 10
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="jamba-large-1.7",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                n=1,
                max_tokens=max_tokens,
                temperature=0.7,
                top_p=1,
                response_format=ResponseFormat(type="text")
            )
            
            print(f'response: {response}')
            total_tokens = response.usage.total_tokens
            if test_type == 'mcq':
                # Accessing the response attributes directly
                choice = response.choices[0]  # Accessing the first choice
                message = choice.message  # Accessing the message
                content = message.content  # Accessing the content of the message

                # Process the content based on taxonomy level
                lines = [
                        re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip())
                        for line in content.strip().split('\n')
                        if line.strip()  # <-- this removes blank/empty lines
                    ]
                print(f"""
                      
                      content lines: {lines}
                      
                      """)
                # Handle MCQ questions
                if level in ["Remembering", "Understanding", "Analyzing"]:
                    if len(lines) < 4:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid MCQ question and answers.")

                    question = lines[0]  # The first line is the question
                    correct_answer = lines[1]  # The second option is assumed to be the correct answer
                    choices = lines[1:]  # All options including the correct answer

                    # Clean the choices and remove any special characters or numbering
                    choices = [re.sub(r'^\w+\)\s*', '', choice.replace('*', '').strip()) for choice in choices]

                    random.shuffle(choices)  # Randomize choice order

                    letters = ['A', 'B', 'C', 'D']
                    choice_dict = [choices[i] for i in range(len(choices))]

                    # Determine the letter for the correct answer based on its content after cleaning
                    correct_answer_letter = next(
                        letter for letter, choice in zip(letters, choice_dict) if choice == correct_answer.strip())
                    
                    # Create a dictionary to store the question, choices, correct answer, and letter for correct answer
                    question_dict = {
                        "question": question,
                        "correct_answer": correct_answer,
                        "choices": choice_dict,  # Use the dictionary that maps letters to choices
                        # "index": index,  uncomment mo nalang sayo ta ayaw gumana dito baka may dependency na wala dito.hahaha
                        "answer": correct_answer_letter,
                        "test_type": 'mcq',
                        "total_tokens": total_tokens
                    }


                # Handle Problem-based questions for other levels
                else:
                    if len(lines) < 1:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid problem-based question.")

                    question = lines[0]  # The whole content is treated as a single question or problem
                    question_dict = {
                        "question": question,
                        "test_type": 'subjective',
                        "from" : 'mcq',
                        "total_tokens": total_tokens
                    }

                return question_dict
            elif test_type == 'identification':
                # Accessing the response attributes directly
                choice = response.choices[0]  # Accessing the first choice
                message = choice.message  # Accessing the message
                content = message.content  # Accessing the content of the message

                # Process the content based on taxonomy level
                lines = [re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip()) for line in
                        content.strip().split('\n')]

                # Handle MCQ questions
                if level in ["Remembering", "Understanding", "Analyzing"]:
                    if len(lines) < 4:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid MCQ question and answers.")

                    question = lines[0]  # The first line is the question
                    correct_answer = lines[2]  # The second option is assumed to be the correct answer
                    choices = lines[2:]  # All options including the correct answer

                    # Clean the choices and remove any special characters or numbering
                    choices = [re.sub(r'^\w+\)\s*', '', choice.replace('*', '').strip()) for choice in choices]

                    

                    letters = ['A']
                    choice_dict = [choices[i] for i in range(len(choices))]

                    # Determine the letter for the correct answer based on its content after cleaning
                    correct_answer_letter = next(
                        letter for letter, choice in zip(letters, choice_dict) if choice == correct_answer.strip())

                    # Create a dictionary to store the question, choices, correct answer, and letter for correct answer
                    question_dict = {
                        "question": question,
                        "correct_answer": correct_answer,
                        "choices": choice_dict,  # Use the dictionary that maps letters to choices
                        # "index": index,  uncomment mo nalang sayo ta ayaw gumana dito baka may dependency na wala dito.hahaha
                        "answer": correct_answer_letter,
                        "test_type": 'identification',
                        "total_tokens": total_tokens
                       
                    }


                # Handle Problem-based questions for other levels
                else:
                    if len(lines) < 1:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid problem-based question.")

                    question = lines[0]  # The whole content is treated as a single question or problem
                    question_dict = {
                        "question": question,
                         "test_type": 'subjective',
                          "from" : 'identification',
                        "total_tokens": total_tokens
                    }

                return question_dict
            elif test_type == 'subjective':
                # Accessing the response attributes directly
                choice = response.choices[0]  # Accessing the first choice
                message = choice.message  # Accessing the message
                content = message.content  # Accessing the content of the message

                # Process the content based on taxonomy level
                lines = [re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip()) for line in
                        content.strip().split('\n')]

                # Handle MCQ questions
                if level in ["Remembering", "Understanding", "Analyzing"]:
                    if len(lines) < 4:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid MCQ question and answers.")

                    question = lines[0]  # The first line is the question
                    correct_answer = lines[2]  # The second option is assumed to be the correct answer
                    choices = lines[2:]  # All options including the correct answer

                    # Clean the choices and remove any special characters or numbering
                    choices = [re.sub(r'^\w+\)\s*', '', choice.replace('*', '').strip()) for choice in choices]

                    

                    letters = ['A']
                    choice_dict = [choices[i] for i in range(len(choices))]

                    # Determine the letter for the correct answer based on its content after cleaning
                    correct_answer_letter = next(
                        letter for letter, choice in zip(letters, choice_dict) if choice == correct_answer.strip())

                    # Create a dictionary to store the question, choices, correct answer, and letter for correct answer
                    question = lines[0]  # The whole content is treated as a single question or problem
                    question_dict = {
                        "question": question,
                         "test_type": 'subjective',
                        "total_tokens": total_tokens
                          
                    }



                # Handle Problem-based questions for other levels
                else:
                    if len(lines) < 1:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid problem-based question.")

                    question = lines[0]  # The whole content is treated as a single question or problem
                    question_dict = {
                        "question": question,
                         "test_type": 'subjective',
                        "total_tokens": total_tokens
                          
                    }

                return question_dict
            
            elif test_type == 'trueOrFalse':
                raw_content = response.choices[0].message.content
                print("Raw Output Content:")
                print(raw_content)

                # For True/False questions
                if level in ["Remembering", "Understanding", "Analyzing"]:
                    # Extract the statement and answer
                    lines = raw_content.strip().split('\n')
                    if lines:
                        # Clean and format the output
                        statement_with_answer = lines[0].strip()

                        # Remove any extra "True" or "False" at the end of the statement, including punctuation
                        statement_with_answer = re.sub(r'\s*[\.\*\_\-\—]*\b(True|False)\b[\.\*\_\-\—]*$', '', statement_with_answer).strip()

                        # Determine the correct True/False answer based on the content
                        if "true" in raw_content.lower():
                            true_false = "True"
                        else:
                            true_false = "False"

                        # Ensure the statement is not empty or just "True"/"False"
                        if statement_with_answer and statement_with_answer.lower() not in ["true", "false"]:
                            # Create a dictionary to store the cleaned statement and the True/False answer
                            question_dict = {
                                "question": statement_with_answer,
                                "answer": true_false,
                                "test_type": 'trueOrFalse',
                                "total_tokens": total_tokens
                                # "index":index
                            }
                            return question_dict
                        else:
                            print("Invalid output detected, regenerating question...")
                            retries += 1
                            continue
                else:
                    
                    question_dict = {
                        "question": raw_content,
                         "test_type": 'subjective',
                         "from": 'trueOrFalse',
                        "total_tokens": total_tokens
                    }

                return question_dict

        except Exception as e:
            retries += 1
            wait_time = 2 ** retries  # Exponential backoff
            print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)  # Wait before retrying

    raise RuntimeError("Failed to generate a valid question after several attempts.")


# # Choose a taxonomy level to generate a question
# selected_level = "Creating"  # Replace with the desired level

# # Generate the question, correct answer, and choices
# question_info = generate_question_ai(selected_level, context)

# # Print the generated question information
# print(f"Generated Question Information for {selected_level}:")
# print(question_info)



@csrf_exempt  # Use this only if you're not dealing with CSRF tokens; otherwise, ensure CSRF tokens are handled.
def generate_question(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            
            print(data)
            
            # Example: Extract values from the incoming data
          
            index = data.get('index', 0)
            test_type = data.get('test_type', '')
            context = safe_unicode(test_type+'question: '+data.get('context', 'Default context text'))
            taxonomy_level = data.get('taxonomy_level', '')
        
            
            generated_ques = generate_question_ai(str(taxonomy_level), context,index,test_type)


            # Process the data as needed, e.g., generate a question
            # Here, we are just returning the data as a response
            
            # Create response data
            response_data = generated_ques
            print(response_data)

            # Return a successful JSON response
            return JsonResponse(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)+"errorhere"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # If the request method is not POST, return a method not allowed response
    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



# Extract text from the PDF within specific bounds
def extract_within_bounds(pdf_file, header_height, footer_height):
    start_keyword = 'LEARNING CONTENTS'
    stop_keyword = 'SUMMARY'
    try:
        with pdfplumber.open(pdf_file) as pdf:
            extracting = False  # Flag to indicate when to start and stop extraction
            extracted_text = []

            for page in pdf.pages:
                # Define the area without the header and footer
                bbox = (0, header_height, page.width, page.height - footer_height)
                cropped_page = page.within_bbox(bbox)
                text = cropped_page.extract_text()

                if text:  # Ensure there is text before processing
                    # Check if the start keyword is found to begin extraction
                    if start_keyword in text and not extracting:
                        extracting = True
                        # Add text up to where the start keyword is found
                        extracted_text.append(text.split(start_keyword, 1)[1])

                    # Append text if extraction has started
                    elif extracting:
                        extracted_text.append(text)

                    # Check if the stop keyword is found to end extraction
                    if stop_keyword in text and extracting:
                        extracting = False
                        break  # Stop processing further pages after finding the stop keyword
            return '\n'.join(extracted_text)
    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        print(traceback.format_exc())
        return None  # Return None if an error occurs
# Declare ques_gen as a global variable
ques_gen = []

@csrf_exempt
def generate_question_with_module(request):
    global ques_gen  # Refer to the global variable

    if request.method == 'POST':
        try:
            generated_questions = []

            # Debugging output to check the contents of ques_gen
            print("Current ques_gen:", ques_gen)

            mcq_count = sum(1 for question in ques_gen if question.get('test_type') == 'mcq' or question.get('from') == 'mcq' )
            identification_count = sum(1 for question in ques_gen if question.get('test_type') == 'identification' or question.get('from') == 'identification')
            trueOrFalse_count = sum(1 for question in ques_gen if question.get('test_type') == 'trueOrFalse' or question.get('from') == 'trueOrFalse')
            subjective_count = sum(1 for question in ques_gen if question.get('test_type') == 'subjective' or question.get('from') == 'subjective')
            
            

            file = request.FILES.get('file')
            last = int(request.POST.get('last', 0))
            subtest = int(request.POST.get('subjective', 0)) - subjective_count
            mcq = int(request.POST.get('mcq', 0)) - mcq_count
            identification = int(request.POST.get('identification', 0)) - identification_count
            trueOrFalse = int(request.POST.get('trueOrFalse', 0)) - trueOrFalse_count
            
            print(f'True or false count: {trueOrFalse}')
            print(f'identification count: {identification}')
            print(f'mcq count: {mcq}')
            print(f'subjective count: {subtest}')
            numques = int(request.POST.get('numques', 0))

            Remembering = int(request.POST.get('Remembering', 0))
            Understanding = int(request.POST.get('Understanding', 0))
            Applying = int(request.POST.get('Applying', 0))
            Analyzing = int(request.POST.get('Analyzing', 0))
            Evaluating = int(request.POST.get('Evaluating', 0))
            Creating = int(request.POST.get('Creating', 0))

            if not file:
                return JsonResponse({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

            # Debug log for file and form data
            print(f"Received file: {file.name}")
           

            # Extract text from the PDF
            extracted_text = safe_unicode(extract_within_bounds(file, 70, 50))
            if extracted_text is None:
                return JsonResponse({"error": "Failed to extract text from the PDF"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Debug log for extracted text
            print(f"Extracted Text: {extracted_text}")
            
            lines = len(extracted_text.splitlines())
            extracted_lines = int(lines/numques)
            # extracted_lines = 6
            print("extracted_lines")
            print(extracted_lines)
            print("numques", numques)
            paragraphs = split_context_into_paragraphs(extracted_text,extracted_lines)

            # Initialize list to store all generated questions
            

            # Simulate generating questions
         

            for i in range(min(int(numques), len(paragraphs))):
                
                selected_level = ""
                if Remembering!=0:
                    selected_level = "Remembering"
                    Remembering -=1
                elif Understanding!=0:
                    selected_level = "Understanding"
                    Understanding -=1
                elif Applying!=0:
                    selected_level = "Applying"
                    Applying -=1
                elif Analyzing!=0:
                    selected_level = "Analyzing"
                    Analyzing -=1
                elif Evaluating!=0:
                    selected_level = "Evaluating"
                    Evaluating -=1
                elif Creating!=0:
                    selected_level = "Creating"
                    Creating -=1
                generated_ques =  {}
                if selected_level in ['Remembering','Understanding','Analyzing']:
                    if mcq != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'mcq',extracted_text)
                        mcq -= 1
                    elif identification != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'identification',extracted_text)
                        identification -= 1
                    elif trueOrFalse != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'trueOrFalse',extracted_text)
                        trueOrFalse -= 1
                else:
                    if subtest != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'subjective',extracted_text)
                        subtest -= 1

                print(f"Generated Question {i + 1} for {selected_level}:")
                # print(generated_ques)
                ques_gen.append(generated_ques)  # Append to global ques_gen list
                # print(ques_gen)
                # Append each generated question to the list
                generated_questions.append({
                    "question_number": i + 1,
                    "level": selected_level,
                    "question": generated_ques
                })
                
                
                print(f'last module: {last}')
                if last == 1:
                    ques_gen = []
                           
            return JsonResponse({"generated_questions": generated_questions}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)+"errorhere"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



# You can access ques_gen from outside the function



ques_gen = []

# Function to extract and count taxonomy levels
def extract_taxonomy_levels(response_content):
    # Define the Bloom's Taxonomy levels
    taxonomy_levels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"]
    
    # Initialize a dictionary to count the occurrences of each level
    taxonomy_counts = {level: 0 for level in taxonomy_levels}
    
    # Iterate through the taxonomy levels and count occurrences in the response content
    for level in taxonomy_levels:
        # Use regex to find all occurrences of the level in the response content (case-sensitive)
        count = len(re.findall(rf"\b{level}\b", response_content))
        taxonomy_counts[level] = count
    
    return taxonomy_counts


# Extract and count Bloom's Taxonomy levels


objective_prompt = "Be consistent. Identify the Bloom's taxonomy levels corresponding to each of these learning objectives: {}. Only respond with one or more of the following levels: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating."

objective_count = "Make each of these learning outcomes to be in theri own single line:{}. Only respond with the modified learning outcomes nothing else"



def objectives_percentage(objectives):
    retries = 0
    max_retries = 5
    
    
    prompt =  objective_prompt.format(objectives)

    while retries < max_retries:
        try:
            # API call to OpenAI or the client
            response = client.chat.completions.create(
                model="jamba-mini-1.7",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                n=1,
                max_tokens=max_tokens,
                temperature=0,
                top_p=1,
                response_format=ResponseFormat(type="text")
            )

            # Access the response attributes directly
            choice = response.choices[0]  # Accessing the first choice
            message = choice.message  # Accessing the message
            content = message.content  # Accessing the content of the message
            
            # Print the raw response for debugging (optional)
            # print(f"Raw response: {response}")
            # print("objectives: "+objectives)
            # print("content: "+content)
            total_tokens = response.usage.total_tokens
            # Extract taxonomy levels from the response content
            taxonomy_counts = extract_taxonomy_levels(content)
            taxonomy_counts['total_tokens'] = total_tokens
            print("taxonomy_counts: ",taxonomy_counts)
            # Output the result
            print(f"Taxonomy counts: {taxonomy_counts}")
            return taxonomy_counts  # Return the counts if needed

        except Exception as e:
            retries += 1
            wait_time = 2 ** retries  # Exponential backoff
            print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)  # Wait before retrying

    # Return None or an empty result if retries exhausted
    return None


def objectives_count(objectives):
        
    prompt =  objective_count.format(objectives)


            # API call to OpenAI or the client
    response = client.chat.completions.create(
                model="jamba-mini-1.7",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                n=1,
                max_tokens=max_tokens,
                temperature=0,
                top_p=1,
                response_format=ResponseFormat(type="text")
            )

    choice = response.choices[0]  # Accessing the first choice
    message = choice.message  # Accessing the message
    content = message.content  # Accessing the content of the message

    # Regex to find numbered items and remove the period after the number
    # Matches patterns like "1.", "2.", "3.", etc., and replaces them with "1 ", "2 ", "3 ", etc.
    modified_text = content.split("\n")
    
    return modified_text

@csrf_exempt
def taxonomy_allocation(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            learning_objectives = data.get('objectives', 'leaning_objectives')
            print('herealloc: ')
            print(learning_objectives)
            allocation = objectives_percentage(learning_objectives)
            
            

            return JsonResponse({"allocation": allocation}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



def lesson_summary(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    # Remove spaces in the keywords for comparison
    start_keyword_clean = [word.replace(" ","") for word in start_keyword] 
    stop_keyword_clean = stop_keyword.replace(" ", "")
    
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Remove spaces from the extracted text for comparison
                stripped_text = text.replace(" ", "").strip()

                # Check if the start keyword is found to begin extraction
                if any(cleaned in stripped_text for cleaned in start_keyword_clean ) and not extracting:
                    extracting = True
                    matched = next((k for k in start_keyword if k in text), None)
                    # Ensure the start keyword is in the text before splitting
                    if matched:
                        extracted_text.append(text.split(matched, 1)[1].strip())
                    else:
                        extracted_text.append(text)  # Fallback if split fails

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword_clean in stripped_text and extracting:
                    extracting = False
                    # Add text up to where the stop keyword is found
                    if stop_keyword in text:
                        extracted_text.append(text.split(stop_keyword, 1)[0].strip())
                    else:
                        extracted_text.append(text)  # Fallback if split fails
                    break  # Stop processing further pages after finding the stop keyword

        # Join the extracted text and split into lines
        lines = '\n'.join(extracted_text).splitlines()

        # Return the second line if it exists, otherwise return an empty string
        return lines[1].strip() if len(lines) > 1 else ''

def extract_unit_content_first(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Check if the start keyword is found to begin extraction
                if start_keyword in text and not extracting:
                    extracting = True
                    # Add text up to where the start keyword is found
                    extracted_text.append(text.split(start_keyword, 1)[0])

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword in text and extracting:
                    extracting = False
                    break  # Stop processing further pages after finding the stop keyword

        return '\n'.join(extracted_text)

def extract_unit_content_second(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to indicate when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            if text:  # Ensure there is text before processing
                # Check if the start keyword is found to begin extraction
                if start_keyword in text and not extracting:
                    extracting = True
                    # Add text from where the start keyword is found
                  

                # Append text if extraction has started
                elif extracting:
                    extracted_text.append(text)

                # Check if the stop keyword is found to end extraction
                if stop_keyword in text and extracting:
                    extracting = False
                    extracted_text.append(text.split(stop_keyword, 1)[0])
                    break  # Stop processing further pages after finding the stop keyword

        return '\n'.join(extracted_text)

def compare_extracted_texts(text1, text2):
    # Split the texts into lists of lines for comparison
    lines1 = text1.splitlines()
    lines2 = text2.splitlines()

    # Use difflib to get the differences between the two texts
    diff = difflib.ndiff(lines1, lines2)

    # Display only the differences in a readable format
    differences = []

    for line in diff:
        if line.startswith('- ') or line.startswith('+ '):
            # Strip the leading '- ' or '+ ' from the line
            differences.append(line[2:])  # Remove the first two characters

    return '\n'.join(differences)




@csrf_exempt
def read_pdf(request):
    global ques_gen  # Refer to the global variable

    if request.method == 'POST':
        try:
            generated_questions = []

            file = request.FILES.get('file')
            
            pdf_path = file
            header_height = 70
            footer_height = 50
            start_keyword_lesson = ['STUDY GUIDE','MODULE']
            stop_keyword_lesson = 'MODULE OVERVIEW'

            extracted_text_lesson = lesson_summary(pdf_path, header_height, footer_height, start_keyword_lesson, stop_keyword_lesson)
            
            
            start_keyword = 'LEARNING OBJECTIVES'
            stop_keyword = 'LEARNING CONTENTS'

            extracted_text_first = extract_unit_content_first(pdf_path, header_height, footer_height, start_keyword, stop_keyword)
            extracted_text_second = extract_unit_content_second(pdf_path, header_height, footer_height, start_keyword, stop_keyword)

            # Compare the texts and print the differences
            differences = compare_extracted_texts(extracted_text_first, extracted_text_second)
            # Output only from line 3 onward
            output_lines = differences.splitlines()

            # Store the output from line 3 in a variable
            learning_outcomes = '\n'.join(output_lines[2:])  # Skip the first two lines
          
            if not file:
                return JsonResponse({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
            extracted_text_lesson = safe_unicode(extracted_text_lesson)
            learning_outcomes = safe_unicode(learning_outcomes)
            # Debug log for file and form data
            print(f"Received file: {file.name}")
            
            generated_questions.append({
                    "lesson_topic": extracted_text_lesson,
                    "learning_outcomes": learning_outcomes
                })
           

            # Extract text from the PDF
            
            if extracted_text_lesson is None:
                return JsonResponse({"error": "Failed to extract text from the PDF"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Debug log for extracted text
            # print(f"Extracted Text: {extracted_text_lesson}")

                           
            return JsonResponse({"lesson_info": generated_questions}, status=status.HTTP_200_OK)

        except Exception as e:
            exc_type, exc_value, exc_tb = sys.exc_info()
            line_number = exc_tb.tb_lineno
            error_message = f"Error: {e} (line {line_number})"
            print(error_message)
            traceback.print_exc()  # This prints the full traceback in your console
            return JsonResponse({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def validate_file(pdf_file, header_height, footer_height):
    start_keyword = 'LEARNING CONTENTS'
    stop_keyword = 'SUMMARY'
    required_keywords = ['LEARNING OBJECTIVES', 'LEARNING CONTENTS']  # List of required keywords to check for

    try:
        with pdfplumber.open(pdf_file) as pdf:
            extracting = False  # Flag to indicate when to start and stop extraction
            extracted_text = []
            found_keywords = {key: False for key in required_keywords}  # Track if keywords are found

            for page in pdf.pages:
                # Define the area without the header and footer
                bbox = (0, header_height, page.width, page.height - footer_height)
                cropped_page = page.within_bbox(bbox)
                text = cropped_page.extract_text()

                if text:  # Ensure there is text before processing
                    # Check if each required keyword is present in the text
                    for keyword in required_keywords:
                        if keyword in text:
                            found_keywords[keyword] = True

                    # Check if the start keyword is found to begin extraction
                    if start_keyword in text and not extracting:
                        extracting = True
                        # Add text up to where the start keyword is found
                        extracted_text.append(text.split(start_keyword, 1)[1])

                    # Append text if extraction has started
                    elif extracting:
                        extracted_text.append(text)

                    # Check if the stop keyword is found to end extraction
                    if stop_keyword in text and extracting:
                        extracting = False
                        break  # Stop processing further pages after finding the stop keyword

            # Check if all required keywords were found
            missing_keywords = [key for key, found in found_keywords.items() if not found]

            if missing_keywords:
                return {"status": "Invalid", "missing_keywords": missing_keywords}

            return {"status": "Valid", "missing_keywords": []}

    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        print(traceback.format_exc())
        return None  # Return None if an error occurs
    

@csrf_exempt
def validate_pdf(request):
    global ques_gen  # Refer to the global variable

    if request.method == 'POST':
        try:
            file_status = []

            file = request.FILES.get('file')
            
            pdf_path = file
            header_height = 70
            footer_height = 50

            if not file:
                return JsonResponse({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

            # Debug log for file and form data
            print(f"Received file: {file.name}")
            
            validation_result = validate_file(pdf_path, header_height, footer_height)
            file_status.append(validation_result)
            
            print(file_status)

            return JsonResponse({"file_status": file_status}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@csrf_exempt
def outcomes_count(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            learning_objectives = data.get('objectives', 'leaning_objectives')
            
            outcomes= objectives_count(str(learning_objectives))
            print("here:")
            print(outcomes)

            return JsonResponse({"outcomes": outcomes}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


