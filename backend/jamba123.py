from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat

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
        "Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
    ),
    "Understanding": (
        "Create a question that asks for an explanation of the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
    ),
    "Applying": (
        "Create a question that requires applying the following context to a new situation: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
    ),
    "Analyzing": (
        "Create a question that involves analyzing or breaking down the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
    ),
    "Evaluating": (
        "Create a a multiple-choice question that requires evaluating or making a judgment based on the following context: {context}. "
        "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
    ),
    "Creating": (
        "Create a a multiple-choice question that involves creating new ideas based on the following context: {context} with four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
        "Output the question immediately without any introductory words"
        "Do not use any indicator letters or numbers for answer and distractors"
    )
}

def generate_question(level, context, max_retries=5):
    prompt = prompts[level].format(context=context)
    retry_count = 0

    while retry_count < max_retries:
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
                temperature=0.4,
                top_p=1,
                stop=[],
                response_format=ResponseFormat(type="text")
            )

            # Access the response content
            content = response.choices[0].message.content.strip()

            # Process the content by splitting into lines and stripping any extra spaces
            lines = [line.strip() for line in content.split('\n') if line.strip()]

            # Validate and ensure we have a question and at least 4 options
            if len(lines) < 5:
                retry_count += 1
                continue  # Retry if the response was incomplete

            question = lines[0]  # Question is the first line
            correct_answer = lines[1]  # First option is the correct answer
            distractors = lines[2:5]  # Next three options are distractors

            # Create a dictionary to store the question, correct answer, and distractors
            question_dict = {
                "question": question,
                "correct_answer": correct_answer,
                "distractors": distractors
            }

            return question_dict
        except Exception as e:
            retry_count += 1

    return {"error": "Failed to generate a valid question after multiple attempts."}

# Choose a taxonomy level to generate a question
selected_level = "Creating"  # Replace with the desired level

# Generate the question, correct answer, and distractors
question_info = generate_question(selected_level, context)

# Print the generated question information
print(f"Generated Question Information for {selected_level}:")
print(question_info)
