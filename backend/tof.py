# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
# import time
# import re
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
# )
#
# # Define prompts for each taxonomy level
# prompts = {
#     "Remembering": (
#         f"Create a True or False question that tests the recall of specific facts directly mentioned in the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text."
#         "Create also false statements"
#     ),
#     "Understanding": (
#         f"Create a True or False question that asks for an explanation of the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
#         "Create also false statements"
#     ),
#     "Applying": (
#         f"Create a True or False question that requires applying the following context to a new situation: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
#         "Create also false statements"
#     ),
#     "Analyzing": (
#         f"Create a True or False question that involves analyzing or breaking down the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
#         "Create also false statements"
#     ),
#     "Evaluating": (
#         f"Create a True or False question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
#         "Create also false statements"
#     ),
#     "Creating": (
#         f"Create a True or False question that involves generating new ideas based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
#         "Create also false statements"
#     )
# }
#
#
# def generate_true_false_question(level, context):
#     prompt = prompts[level].format(context=context)
#
#     retries = 0
#     max_retries = 5
#     while retries < max_retries:
#         try:
#             response = client.chat.completions.create(
#                 model="jamba-1.5-mini",
#                 messages=[
#                     ChatMessage(
#                         role="user",
#                         content=prompt
#                     )
#                 ],
#                 documents=[],
#                 tools=[],
#                 n=1,
#                 max_tokens=1024,
#                 temperature=0.7,  # Adjust temperature for more variety
#                 top_p=1,
#                 stop=[],
#                 response_format=ResponseFormat(type="text")
#             )
#
#             # Print the raw content before processing
#             raw_content = response.choices[0].message.content
#             print("Raw Output Content:")
#             print(raw_content)
#
#             # Extract the statement and answer
#             lines = raw_content.strip().split('\n')
#             if lines:
#                 # Clean and format the output
#                 statement_with_answer = lines[0].strip()
#
#                 # Remove any extra lines or repeated answers
#                 statement_with_answer = re.sub(r'\s*\(.*\)\s*$', '', statement_with_answer)
#                 statement_with_answer = re.sub(r'\s*False$', 'False', statement_with_answer)
#                 statement_with_answer = re.sub(r'\s*True$', 'True', statement_with_answer)
#
#                 # Determine the correct True/False answer based on the content
#                 if "true" in statement_with_answer.lower():
#                     true_false = "True"
#                 else:
#                     true_false = "False"
#
#                 # Append the answer at the end of the statement
#                 statement_with_answer = f"{statement_with_answer} {true_false}"
#
#                 # Create a dictionary to store the cleaned statement and the True/False answer
#                 question_dict = {
#                     "statement": statement_with_answer,
#                     "answer": true_false
#                 }
#
#                 return question_dict
#
#         except Exception as e:
#             retries += 1
#             wait_time = 2 ** retries  # Exponential backoff
#             print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
#             time.sleep(wait_time)  # Wait before retrying
#
#     raise RuntimeError("Failed to generate a valid question after several attempts.")
#
#
# # Choose a taxonomy level to generate a True or False question
# selected_level = "Remembering"  # Replace with the desired level
#
# # Generate the True or False question
# question_info = generate_true_false_question(selected_level, context)
#
# # Print the generated question information
# print(f"Generated True or False Question Information for {selected_level}:")
# print(question_info)
import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
import time
import re

api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)

# Define the context
context = (
    "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
)

# Define prompts for each taxonomy level
torf_prompts = {
    "Remembering": (
        f"Create a True or False question that tests the recall of specific facts directly mentioned in the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text."
        f" Create also false statements based on the context:{context}."
    ),
    "Understanding": (
        f"Create a True or False question that asks for an explanation of the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        f" Create also false statements based on the context:{context}."
    ),
    "Applying": (
        f"Create a True or False question that requires applying the following context to a new situation: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        f" Create also false statements based on the context:{context}."
    ),
    "Analyzing": (
        f"Create a True or False question that involves analyzing or breaking down the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        f" Create also false statements based on the context:{context}."
    ),
    "Evaluating": (
        f"Create a True or False question that requires evaluating or making a judgment based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        f" Create also false statements based on the context:{context}."
    ),
    "Creating": (
        f"Create a True or False question that involves generating new ideas based on the following context: {context}. "
        "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement."
        f" Create also false statements based on the context:{context}."
    )
}

def generate_true_false_question(level, context):
    prompt = torf_prompts[level]

    retries = 0
    max_retries = 5
    while retries < max_retries:
        try:
            response = client.chat.completions.create(
                model="jamba-1.5-mini",
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
                temperature=0.7,  # Adjust temperature for more variety
                top_p=1,
                stop=[],
                response_format=ResponseFormat(type="text")
            )

            # Print the raw content before processing
            raw_content = response.choices[0].message.content
            print("Raw Output Content:")
            print(raw_content)

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
                        "answer": true_false
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

# Choose a taxonomy level to generate a True or False question
selected_level = "Remembering"  # Replace with the desired level

# Generate the True or False question
question_info = generate_true_false_question(selected_level, context)

# Print the generated question information
print(f"Generated True or False Question Information for {selected_level}:")
print(question_info)
