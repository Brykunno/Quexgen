


import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
import re
import time
import random

api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)


# Define the context
context = "1. Define computer networking 2. Enumerate the different advantages of computer network.3. Explain the different components of computer network."

# Token limit for the Jamba model (rough estimate of word-to-token ratio)
max_tokens = 1024


# Split the context into paragraphs
def split_context_into_paragraphs(context):
    return context.split('\n')

# Number of questions to generate
num_questions = 1

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
        "Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Understanding": (
        "Create a question that asks for an explanation of the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Applying": (
        f"Make a test, problem or question that is aligned with applying level of bloom's taxonomy based on the given context:{context}."

    ),
    "Analyzing": (
        "Create a question that involves analyzing or breaking down the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
        "Output the question immediately without any introductory words."
    ),
    "Evaluating": (
        f"Make a test, problem or question that is aligned with evaluating level of bloom's taxonomy based on the given context:{context}."

    ),
    "Creating": (
        f"Make a test, problem or question that is aligned with creating level of bloom's taxonomy based on the given context:{context}."
    )
}


objective_prompt = "Identify the Bloom's taxonomy levels corresponding to these learning objectives: {}. Only respond with one or more of the following levels: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating."


import re

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


objectives_percentage('1. Explain and compare the different topologies')

def generate_question(level, context_paragraph):
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

            # Accessing the response attributes directly
            choice = response.choices[0]  # Accessing the first choice
            message = choice.message  # Accessing the message
            content = message.content  # Accessing the content of the message
            print(response)

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

        except Exception as e:
            retries += 1
            wait_time = 2 ** retries  # Exponential backoff
            print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)  # Wait before retrying

    raise RuntimeError("Failed to generate a valid question after several attempts.")
paragraphs = split_context_into_paragraphs(context)

# # Generate the specified number of questions from different paragraphs
# for i in range(min(num_questions, len(paragraphs))):
#     selected_level = "Remembering"  # Replace with the desired level for each question
#     question_info = generate_question(selected_level, paragraphs[i])
#     print(f"Generated Question {i + 1} for {selected_level}:")
#     print(question_info)

