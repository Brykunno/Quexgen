from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
from rest_framework import status
import random
import re
import pdfplumber
import io
import traceback 
import time
import difflib



api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)

# Token limit for the Jamba model (rough estimate of word-to-token ratio)
max_tokens = 1024


# Split the context into paragraphs
def split_context_into_paragraphs(context):
    return context.split('\n')

# Number of questions to generate
num_questions = 10

# Define the context
context = (
    "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
)

# Bloom's Taxonomy levels
taxonomy_levels = {
    "Remembering": "Recall basic facts and concepts.",
    "Understanding": "Explain ideas or concepts.",
    "Applying": "Use information in new situations.",
    "Analyzing": "Draw connections among ideas.",
    "Evaluating": "Justify a decision or course of action.",
    "Creating": "Generate new ideas or products."
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
        "Create a remembering multiple-choice question based on bloom's taxonomy that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context:{context}."
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them."
        "Output the question immediately without any introductory words."
    ),
    "Understanding": (
        "Create a understanding question based on bloom's taxonomy that asks for an explanation of the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them."
        "Output the question immediately without any introductory words."
    ),
    "Applying": (
        "Create a question for applying based on bloom's taxonomy that requires applying the following context to a new situation: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them."
         "Output the question immediately without any introductory words."
    ),
    "Analyzing": (
        "Create a question for analyzing based on bloom's taxonomy that involves analyzing or breaking down the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them." 
        "Output the question immediately without any introductory words."
    ),
    "Evaluating": (
        "Create a multiple-choice question for evaluating based on bloom's taxonomy that requires evaluating or making a judgment based on the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them."
        "Output the question immediately without any introductory words."
    ),
    "Creating": (
        "Create a multiple-choice question for creating based on bloom's taxonomy that involves generating new ideas based on the following context: {context}. with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
        "Output the question immediately without any introductory words"
        "Do not use any indicator letters or numbers for answer and distractors"

    )
}

identification_prompt = {
    "Remembering": (
        "Create an identification question aligned with blooms taxonomy remembering level create questions and answer only from the following context: {context}. "
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
        
    ),
    "Understanding": (
        "Create an identification question aligned with blooms taxonomy understanding level create questions and answer only from the following context: {context}. "   
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
    ),
    "Applying": (
        "Create an identification question aligned with blooms taxonomy applying level create questions and answer only from the following context: {context}. "
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
    ),
    "Analyzing": (
        "Create an identification question aligned with blooms taxonomy remembering level create questions and answer only from the following context: {context}. "
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
    ),
    "Evaluating": (
        "Create an identification question aligned with blooms taxonomy evaluating level create questions and answer only from the following context: {context}. "
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
    ),
    "Creating": (
        "Create an identification question aligned with blooms taxonomy creating level create questions and answer only from the following context: {context}. "
        "Provide a question followed by four answer options in a list format. The correct term should be listed first, followed by three plausible but incorrect terms. "
        "Ensure that the options are presented in plain text without any labels such as letters or numbers preceding them. "
        "Output the question immediately without including any introductory words."
        "Make the answer only one word or phrase"
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
                model="jamba-1.5-large",
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
                choices = lines[2:]  # All four options including the correct answer
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

def generate_question_module(level, context_paragraph,test_type):
    
    # Choose prompt based on taxonomy level
    
    if test_type =='trueOrFalse':
        prompt = torf_prompts[level].format(context_paragraph)
    elif test_type =='identification':
         if level in ["Remembering", "Understanding", "Analyzing"]:
            prompt = identification_prompt[level].format(context=context_paragraph)  # Format the prompt with the context
         elif level in ["Applying", "Evaluating", "Creating"]:
            prompt = f"Create a problem or question that requires {taxonomy_levels[level]} based on the following context: {context_paragraph}. Output the question immediately without any introductory words."
        
    else:
        if level in ["Remembering", "Understanding", "Analyzing"]:
            prompt = prompts[level].format(context=context_paragraph)  # Format the prompt with the context
        elif level in ["Applying", "Evaluating", "Creating"]:
            prompt = f"Create a problem or question that requires {taxonomy_levels[level]} based on the following context: {context_paragraph}. Output the question immediately without any introductory words."

    retries = 0
    max_retries = 5
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="jamba-1.5-large",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                n=1,
                max_tokens=max_tokens,
                temperature=0.4,
                top_p=1,
                response_format=ResponseFormat(type="text")
            )

            if test_type == 'mcq':
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
                        "test_type": 'mcq'
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
                        "from" : 'mcq'
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
                        "test_type": 'identification'
                       
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
                          "from" : 'identification'
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
                                "test_type": 'trueOrFalse'
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
                         "from": 'trueOrFalse'
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
          
            extracted_text = extract_within_bounds('Net-101-Study-Guide-Module2.pdf', 70, 50)
            
            options = data.get('options', [])
            index = data.get('index', 0)
            test_type = data.get('test_type', '')
            context = test_type+'question: '+data.get('context', 'Default context text')
            print(extracted_text)
            answer = "True"
            taxonomy_level = data.get('taxonomy_level', '')
        
            
            generated_ques = generate_question_ai(str(taxonomy_level), context,index,test_type)


            # Process the data as needed, e.g., generate a question
            # Here, we are just returning the data as a response
            
            # Create response data
            response_data = generated_ques
            print(response_data)

            # Return a successful JSON response
            return JsonResponse(response_data, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)
    
    # If the request method is not POST, return a method not allowed response
    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



# Extract text from the PDF within specific bounds
def extract_within_bounds(pdf_file, header_height, footer_height):
    try:
        with pdfplumber.open(pdf_file) as pdf:
            extracting = False
            extracted_text = []

            for page in pdf.pages:
                bbox = (0, header_height, page.width, page.height - footer_height)
                cropped_page = page.within_bbox(bbox)
                text = cropped_page.extract_text()

                if 'LEARNING CONTENTS' in text:
                    extracting = True
                    extracted_text.append(text.split('LEARNING CONTENTS', 1)[1])

                if extracting:
                    extracted_text.append(text)

                if 'SUMMARY' in text:
                    extracting = False
                    break

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
            extracted_text = extract_within_bounds(file, 70, 50)
            if extracted_text is None:
                return JsonResponse({"error": "Failed to extract text from the PDF"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Debug log for extracted text
            print(f"Extracted Text: {extracted_text}")
            paragraphs = split_context_into_paragraphs(extracted_text)

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
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'mcq')
                        mcq -= 1
                    elif identification != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'identification')
                        identification -= 1
                    elif trueOrFalse != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'trueOrFalse')
                        trueOrFalse -= 1
                else:
                    if subtest != 0:
                        generated_ques = generate_question_module(selected_level, paragraphs[i], 'subjective')
                        subtest -= 1

                print(f"Generated Question {i + 1} for {selected_level}:")
                print(generated_ques)
                ques_gen.append(generated_ques)  # Append to global ques_gen list
                print(ques_gen)
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
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


objective_prompt = "Identify the Bloom's taxonomy levels corresponding to these learning objectives: {}. Only respond with one or more of the following levels: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating."

def objectives_percentage(objectives):
    retries = 0
    max_retries = 5
    max_tokens = 100  # Ensure you set the max_tokens if it's not defined elsewhere
    
    prompt =  objective_prompt.format(objectives)

    while retries < max_retries:
        try:
            # API call to OpenAI or the client
            response = client.chat.completions.create(
                model="jamba-1.5-large",
                messages=[
                    ChatMessage(
                        role="user",
                        content=prompt
                    )
                ],
                n=1,
                max_tokens=max_tokens,
                temperature=0.4,
                top_p=1,
                response_format=ResponseFormat(type="text")
            )

            # Access the response attributes directly
            choice = response.choices[0]  # Accessing the first choice
            message = choice.message  # Accessing the message
            content = message.content  # Accessing the content of the message
            
            # Print the raw response for debugging (optional)
            print(f"Raw response: {response}")
            print("objectives: "+objectives)
            # Extract taxonomy levels from the response content
            taxonomy_counts = extract_taxonomy_levels(content)

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



@csrf_exempt
def taxonomy_allocation(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            learning_objectives = data.get('objectives', 'leaning_objectives')
            print(learning_objectives)
            allocation = objectives_percentage(learning_objectives)
            return JsonResponse({"allocation": allocation}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



def lesson_summary(pdf_path, header_height, footer_height, start_keyword, stop_keyword):
    # Remove spaces in the keywords for comparison
    start_keyword_clean = start_keyword.replace(" ", "")
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
                if start_keyword_clean in stripped_text and not extracting:
                    extracting = True
                    # Ensure the start keyword is in the text before splitting
                    if start_keyword in text:
                        extracted_text.append(text.split(start_keyword, 1)[1].strip())
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
            start_keyword_lesson = 'STUDY GUIDE'
            stop_keyword_lesson = 'MODULE OVERVIEW'

            extracted_text_lesson = lesson_summary(pdf_path, header_height, footer_height, start_keyword_lesson, stop_keyword_lesson)
            print(extracted_text_lesson)
            
            start_keyword = 'MODULE LEARNING OBJECTIVES'
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
            print(f"Extracted Text: {extracted_text_lesson}")

                           
            return JsonResponse({"lesson_info": generated_questions}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during question generation: {e}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


