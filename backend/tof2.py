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
#         f"Create a True or False question that align with remembering level of bloom's taxonomy based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or false to be 50% "
#     ),
#     "Understanding": (
#         f"Create a True or False question that align with understanding level of bloom's taxonomy based on the following context: {context}. "
#          "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or a false fifty percent "
#     ),
#     "Applying": (
#         f"Create a True or False question that align with applying level of bloom's taxonomy based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or a false fifty percent "
#     ),
#     "Analyzing": (
#         f"Create a True or False question that align with analyzing level of bloom's taxonomy based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or a false fifty percent "
#     ),
#     "Evaluating": (
#         f"Create a True or False question that align with evaluating level of bloom's taxonomy based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or a false fifty percent "
#     ),
#     "Creating": (
#         f"Create a True or False question tthat align with creating level of bloom's taxonomy based on the following context: {context}. "
#         "Generate only one statement that could be either true or false. Include the answer (True or False) directly at the end of the statement with only plain text and don't use parenthesis."
#         "Make the chance of being a true or a false fifty percent "
#     )
# }
#
# def generate_true_false_question(level, context):
#     prompt = prompts[level]
#
#     retries = 0
#     max_retries = 5
#     while retries < max_retries:
#         try:
#             response = client.chat.completions.create(
#                 model="jamba-1.5-large",
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
#                 # Remove any extra "True" or "False" at the end of the statement, including punctuation
#                 statement_with_answer = re.sub(r'\s*[\.\*\_\-\—]*\b(True|False)\b[\.\*\_\-\—]*$', '', statement_with_answer).strip()
#
#                 # Determine the correct True/False answer based on the content
#                 if "true" in raw_content.lower():
#                     true_false = "True"
#                 else:
#                     true_false = "False"
#
#                 # Ensure the statement is not empty or just "True"/"False"
#                 if statement_with_answer and statement_with_answer.lower() not in ["true", "false"]:
#                     # Create a dictionary to store the cleaned statement and the True/False answer
#                     question_dict = {
#                         "statement": statement_with_answer,
#                         "answer": true_false
#                     }
#                     return question_dict
#                 else:
#                     print("Invalid output detected, regenerating question...")
#                     retries += 1
#                     continue
#
#         except Exception as e:
#             retries += 1
#             wait_time = 2 ** retries  # Exponential backoff
#             print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
#             time.sleep(wait_time)  # Wait before retrying
#
#     raise RuntimeError("Failed to generate a valid question after several attempts.")
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
import random

api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
client = AI21Client(api_key=api_key)

# Define the context
context = (
    "1. Premechanical\n"
    "The premechanical age of technology is the earliest known form of ICT. It can be defined as the time between 3000B.C. and 1450A.D. Which is a very long time ago. But this is when humans first started communicating and try to do this in several ways including trying to use language or simple symbols and picture known as petroglyths which were usually carved into rock. These Petrolglyths made up stories, messages and warnings Early alphabets were developed such as the Phoenician alphabet. As Alphabets became more popular and more commonly used for writing information down, pens and paper began to develop. It just started off as marks on wet clay, but then later paper was created out of Papyrus Plant. The most popular kind of paper was made by the Chinese who made paper from rags. Now that people were writing a lot of information down, they needed ways to keep it all in storage permanently. This is where the first books and libraries were developed. Youve probably heard or seen Egyptian scrolls which was one popular way of writing down information permanently. Some people were binding information together in a book like form. Also during this period were the first numbering systems. Around 100A.D. was when the first 1-9 system was created by people from India. However, it wasn’t until 875A.D. (775 years later) that the number 0 was invented. And yes, now that numbers were created, people wanted stuff to do with them so they created calculators. A calculator was the very first sign of an information processor. The popular model of that time was the abacus.\n"
    "2. Mechanical\n"
    "The mechanical age is when we first start to see connections between our current technology and its ancestors. The mechanical age can be defined as the time between 1450 and 1840. There was a huge explosion of interest in this era, resulting in more technologies being developed. Technologies like the slide rule (Which was an analog computer used for multiplying and dividing) were invented. Blaise Pascal invented the Pascaline which was a very popular mechanical computer. Charles Babbage developed the difference engine which tabulated polynomial equations using the method of finite differences. There were lots of different machines created during this era and while we have not yet gotten to a machine that can do more than one type of calculation in one, like our modern-day calculators, we are still learning about how all our all-in-one machines started. Also, if you look at the size of the machines invented in this time compared to the power behind them it seems (to us) ridiculous to understand why anybody would want to use them, but to the people living in that time ALL these inventions were HUGE.\n"
    "3. Electromechanical\n"
    "Now we are finally getting close to some technologies that resemble our current technology. The electromechanical age can be defined as the time between 1840 and 1940. These are the beginnings of telecommunication. The telegraph was created in the early 1800s. Morse code was created by Samuel Morse in 1835. The telephone (one of the most popular forms of communication ever) was created by Alexander Graham Bell in 1876. The first radio developed by Guglielmo Marconi in 1894. All of these were extremely crucial emerging technologies that led to big advances in the information technology field. The first large-scale automatic digital computer in the United States was the Mark 1 created by Harvard University around 1940. This computer was 8ft high, 50ft long, 2ft wide, and weighed 5 tons - HUGE. It was programmed using punch cards. How does your PC match up to this hunk of metal? It was from huge machines like this that people began to look at downsizing all the parts to first make them usable by businesses and eventually in your own home.\n"
    "4. Electronic (Our current Technology)\n"
    "The electronic age is what we currently live in. It can be defined as the time between 1940 and right now. The ENIAC was the first high-speed, digital computer capable of being reprogrammed to solve a full range of computing problems. This computer was designed to be used by the U.S. Army for artillery firing tables. This machine was even bigger than the Mark 1 taking up 680 square feet and weighing 30 tons - HUGE. It mainly used vacuum tubes to do its calculations. There are 4 main sections of digital computing. The first was the era of vacuum tubes and punch cards like the ENIAC and Mark 1. Rotating magnetic drums were used for internal storage. The second generation replaced vacuum tubes with transistors, punch cards were replaced with magnetic tape, and rotating magnetic drums were replaced by magnetic cores for internal storage. Also, during this time high-level programming languages were created such as FORTRAN and COBOL. The third generation replaced transistors with integrated circuits, magnetic tape was used throughout all computers, and magnetic core turned into metal oxide semiconductors. An actual operating system showed up around this time along with the advanced programming language BASIC. The fourth and latest generation brought in CPUs (central processing units) which contained memory, logic, and control circuits all on a single chip. The personal computer was developed (Apple II). The graphical user interface (GUI) was developed."
)

# Function to split context into smaller chunks
def split_context(context, num_chunks):
    context_words = context.split()
    chunk_size = len(context_words) // num_chunks
    chunks = [" ".join(context_words[i:i + chunk_size]) for i in range(0, len(context_words), chunk_size)]
    return chunks

# Define prompts for each taxonomy level
prompts = {
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

def generate_question(level, context_chunk):
    prompt = prompts[level].format(context_chunk)

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

            # For Applying and Creating levels (problem or task-based questions)
            else:
                return {"task": raw_content.strip()}

        except Exception as e:
            retries += 1
            wait_time = 2 ** retries  # Exponential backoff
            print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)  # Wait before retrying

    raise RuntimeError("Failed to generate a valid question after several attempts.")

# Choose the number of questions to generate and the level
num_questions = 10  # Specify the number of questions you want to generate
selected_level = "Remembering"  # Replace with the desired level (e.g., "Applying", "Understanding", etc.)

# Split the context into smaller chunks
context_chunks = split_context(context, num_questions)

# Generate questions for each chunk
questions = []
for chunk in context_chunks:
    question_info = generate_question(selected_level, chunk)
    questions.append(question_info)

# Print the generated question information
for i, question in enumerate(questions, 1):
    print(f"Generated Question {i} Information for {selected_level}:")
    print(question)
