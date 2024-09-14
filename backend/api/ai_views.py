from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
from rest_framework import status
import random
import re



api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)

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
        "Create a True or False question that tests the recall of specific facts directly mentioned in the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text."
        " Create also false statements based on the context:{context}."
    ),
    "Understanding": (
        "Create a True or False question that asks for an explanation of the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        " Create also false statements based on the context:{context}."
    ),
    "Applying": (
        "Create a True or False question that requires applying the following context to a new situation: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        " Create also false statements based on the context:{context}."
    ),
    "Analyzing": (
        "Create a True or False question that involves analyzing or breaking down the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        " Create also false statements based on the context:{context}."
    ),
    "Evaluating": (
        "Create a True or False question that requires evaluating or making a judgment based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        " Create also false statements based on the context:{context}."
    ),
    "Creating": (
        "Create a True or False question that involves generating new ideas based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        " Create also false statements based on the context:{context}."
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
                statement_with_answer = lines[0].strip()

                # Clean statement and determine True/False answer
                statement_clean = re.sub(r'\s*[\.\*\_\-\—]*\b(True|False)\b[\.\*\_\-\—]*$', '', statement_with_answer).strip()
                true_false = "True" if "true" in raw_content.lower() else "False"

                question_dict = {
                    "question": statement_clean,
                    "answer": true_false,
                    "index": index,
                }

            return question_dict

        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                return {"error": f"Failed to generate a valid question after {max_retries} attempts: {str(e)}"}

    return {"error": "Failed to generate a valid question after multiple attempts."}


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
          
            
            
            options = data.get('options', [])
            index = data.get('index', 0)
            test_type = data.get('test_type', '')
            context = test_type+'question: '+data.get('context', 'Default context text')
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

