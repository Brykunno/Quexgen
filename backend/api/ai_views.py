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

torf_prompts = {
   "Remembering": (
        "Create a True or False question that align with remembering level of bloom's taxonomy based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or false to be 50% "
    ),
    "Understanding": (
        "Create a True or False question that align with understanding level of bloom's taxonomy based on the following context: {context}. "
         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or a false fifty percent "
    ),
    "Applying": (
        "Create a True or False question that align with applying level of bloom's taxonomy based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or a false fifty percent "
    ),
    "Analyzing": (
        "Create a True or False question that align with analyzing level of bloom's taxonomy based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or a false fifty percent "
    ),
    "Evaluating": (
        "Create a True or False question that align with evaluating level of bloom's taxonomy based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or a false fifty percent "
    ),
    "Creating": (
        "Create a True or False question tthat align with creating level of bloom's taxonomy based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
        "Make the chance of being a true or a false fifty percent "
    )
}
def generate_question_ai(level, context_ques, index, test_type, max_retries=5):
    # Select the appropriate prompt based on test type
    if test_type == "trueOrFalse":
        prompt = torf_prompts[level].format(context=context_ques)
    else:
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

def generate_question_module(level, context_paragraph):
    test_type = 'mcq'
    # Choose prompt based on taxonomy level
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
                        "answer": correct_answer_letter
                    }


                # Handle Problem-based questions for other levels
                else:
                    if len(lines) < 1:
                        raise ValueError(
                            "The generated content does not have enough lines for a valid problem-based question.")

                    question = lines[0]  # The whole content is treated as a single question or problem
                    question_dict = {
                        "question": question
                    }

                return question_dict
            elif test_type == 'trueOrFalse':
                raw_content = response.choices[0].message.content
                print("Raw Output Content:")
                print(raw_content)

                # For True/False questions
                if level in ["Remembering", "Understanding", "Analyzing", "Evaluating"]:
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
                                "statement": statement_with_answer,
                                "answer": true_false,
                                # "index":index
                            }
                            return question_dict
                        else:
                            print("Invalid output detected, regenerating question...")
                            retries += 1
                            continue

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

@csrf_exempt
def generate_question_with_module(request):
    if request.method == 'POST':
        try:
            # Handle the file and form data
            file = request.FILES.get('file')
            index = request.POST.get('index', 0)
            mcq = int(request.POST.get('mcq', 0))
            identification = int(request.POST.get('identification', 0))
            trueOrFalse = int(request.POST.get('trueOrFalse', 0))
            numques = mcq+identification+trueOrFalse
            test_type = request.POST.get('test_type', 'mcq')
            context = test_type + ' question: ' + request.POST.get('context', 'Default context text')
            taxonomy_level = request.POST.get('taxonomy_level', 'Remembering')

            if not file:
                return JsonResponse({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

            # Debug log for file and form data
            print(f"Received file: {file.name}")
            print(f"Form Data - Index: {index}, Test Type: {test_type}, Context: {context}, Taxonomy Level: {taxonomy_level}")

            # Extract text from the PDF
            extracted_text = extract_within_bounds(file, 70, 50)
            if extracted_text is None:
                return JsonResponse({"error": "Failed to extract text from the PDF"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Debug log for extracted text
            print(f"Extracted Text: {extracted_text}")
            paragraphs = split_context_into_paragraphs(extracted_text)

            # Initialize list to store all generated questions
            generated_questions = []

            # Simulate generating questions
            for i in range(min(int(numques), len(paragraphs))):
                selected_level = "Remembering"  # Replace with the desired level for each question
                generated_ques = generate_question_module(selected_level, paragraphs[i])
                print(f"Generated Question {i + 1} for {selected_level}:")
                print(generated_ques)

                # Append each generated question to the list
                generated_questions.append({
                    "question_number": i + 1,
                    "level": selected_level,
                    "question": generated_ques
                })

            # Return the list of generated questions
            return JsonResponse({"generated_questions": generated_questions}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the error and stack trace for debugging
            print(f"Error during question generation: {e}")
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


