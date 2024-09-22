


import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
import re
import time
import random
import pdfplumber

api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)

import pdfplumber

def extract_within_bounds(pdf_path, header_height, footer_height):
    with pdfplumber.open(pdf_path) as pdf:
        extracting = False  # Flag to control when to start and stop extraction
        extracted_text = []

        for page in pdf.pages:
            # Define the area without the header and footer
            bbox = (0, header_height, page.width, page.height - footer_height)
            cropped_page = page.within_bbox(bbox)
            text = cropped_page.extract_text()

            # Check if 'LEARNING CONTENT' is in the text to start extraction
            if 'LEARNING CONTENTS' in text:
                extracting = True
                # Add text from where 'LEARNING CONTENT' is found
                extracted_text.append(text.split('LEARNING CONTENTS', 1)[1])
            
            if extracting:
                # Append text if extraction has started
                extracted_text.append(text)

            # Check if 'LEARNING ACTIVITY' is in the text to stop extraction
            if 'SUMMARY' in text:
                extracting = False
                # Add text up to where 'LEARNING ACTIVITY' is found
              
                break  # Stop processing after finding 'LEARNING ACTIVITY'

        return '\n'.join(extracted_text)

# Example usage
extracted_text = extract_within_bounds('Net-101-Study-Guide-Module2.pdf', 70, 50)
print(extracted_text)

# Define the context
context = extracted_text

# Token limit for the Jamba model (rough estimate of word-to-token ratio)
max_tokens = 1024


# Split the context into paragraphs
def split_context_into_paragraphs(context):
    return context.split('\n')

# Number of questions to generate
num_questions = 5

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

# Generate the specified number of questions from different paragraphs
for i in range(min(num_questions, len(paragraphs))):
    selected_level = "Remembering"  # Replace with the desired level for each question
    question_info = generate_question(selected_level, paragraphs[i])
    print(f"Generated Question {i + 1} for {selected_level}:")
    print(question_info)

