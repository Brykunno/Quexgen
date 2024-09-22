# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# # Initialize the AI21 client with your API key
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"  # Replace with your actual API key
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "Now we are finally getting close to some technologies that resemble our current technology. The electromechanical age can be defined as the time between 1840 and 1940. These are the beginnings of telecommunication. The telegraph was created in the early 1800s. Morse code was created by Samuel Morse in 1835. The telephone (one of the most popular forms of communication ever) was created by Alexander Graham Bell in 1876. The first radio developed by Guglielmo Marconi in 1894. All of these were extremely crucial emerging technologies that led to big advances in the information technology field. The first large-scale automatic digital computer in the United States was the Mark 1 created by Harvard University around 1940. This computer was 8ft high, 50ft long, 2ft wide, and weighed 5 tons - HUGE. It was programmed using punch cards. How does your PC match up to this hunk of metal? It was from huge machines like this that people began to look at downsizing all the parts to first make them usable by businesses and eventually in your own home."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# def generate_question(level, context):
#     prompt = {
# 		"Remembering": (
# 			f"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
# 			f"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 			f"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 		),
#         "Understanding": f"Create a question that asks for an explanation of the following context: {context}",
#         "Applying": f"Create a question that requires applying the following context to a new situation: {context}",
#         "Analyzing": f"Create a question that involves analyzing or breaking down the following context: {context}",
#         "Evaluating": f"Create a question that requires evaluating or making a judgment based on the following context: {context}",
#         "Creating": f"Create a question that involves generating new ideas based on the following context: {context}"
#     }
#
#     try:
#         response = client.chat.completions.create(
#             model="jamba-1.5-mini",
#             messages=[
#                 ChatMessage(
#                     role="user",
#                     content=prompt[level]
#                 )
#             ],
#             documents=[],
#             tools=[],
#             n=1,
#             max_tokens=1024,
#             temperature=0.4,
#             top_p=1,
#             stop=[],
#             response_format=ResponseFormat(type="text")
#         )
#
#         # Accessing the response attributes directly
#         choice = response.choices[0]  # Accessing the first choice
#         message = choice.message  # Accessing the message
#         content = message.content  # Accessing the content of the message
#
#         print(f"Generated Question for {level}:")
#         print(content)
#         print("\n")
#     except Exception as e:
#         print(f"An error occurred: {e}")
#
# # Generate questions for all levels
# for level in taxonomy_levels:
#     generate_question(level, context)



# with dictionary


# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# # Initialize the AI21 client with your API key
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"  # Replace with your actual API key
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = ("A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider. ")
#
#
# 	# Bloom's Taxonomy levels
# taxonomy_levels = {
# 	"Remembering": "Recall basic facts and concepts.",
# 	"Understanding": "Explain ideas or concepts.",
# 	"Applying": "Use information in new situations.",
# 	"Analyzing": "Draw connections among ideas.",
# 	"Evaluating": "Justify a decision or course of action.",
# 	"Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
# 	"Remembering": (
# 		"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Understanding": (
# 		"Create a question that asks for an explanation of the following context: {context}"
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Applying": (
# 		"Create a question that requires applying the following context to a new situation: {context}"
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#
# 	),
# 	"Analyzing": ("Create a question that involves analyzing or breaking down the following context: {context}"
# 				  "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				  "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Evaluating": ("Create a question that requires evaluating or making a judgment based on the following context: {context}"
# 				   "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				   "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Creating": ("Create a question that involves generating new ideas based on the following context: {context}"
# 				 "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				 "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 				 )
# }
#
# # Dictionary to hold generated questions and answers
# generated_questions = {}
#
#
# def generate_question(level, context):
# 	prompt = prompts[level].format(context=context)
#
# 	try:
# 		response = client.chat.completions.create(
# 			model="jamba-1.5-mini",
# 			messages=[
# 				ChatMessage(
# 					role="user",
# 					content=prompt
# 				)
# 			],
# 			documents=[],
# 			tools=[],
# 			n=1,
# 			max_tokens=1024,
# 			temperature=0.4,
# 			top_p=1,
# 			stop=[],
# 			response_format=ResponseFormat(type="text")
# 		)
#
# 		# Accessing the response attributes directly
# 		choice = response.choices[0]  # Accessing the first choice
# 		message = choice.message  # Accessing the message
# 		content = message.content  # Accessing the content of the message
#
# 		# Store the generated question and answers in the dictionary
# 		generated_questions[level] = content
# 	except Exception as e:
# 		generated_questions[level] = f"An error occurred: {e}"
#
#
# # Generate questions for all levels
# for level in taxonomy_levels:
# 	generate_question(level, context)
#
# # Print the generated questions and answers
# for level, question in generated_questions.items():
# 	print(f"Generated Question for {level}:")
# 	print(question)
# 	print("\n")





#
#
# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
#     "Remembering": (
#         "Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Understanding": (
#         "Create a question that asks for an explanation of the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Applying": (
#         "Create a question that requires applying the following context to a new situation: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Analyzing": (
#         "Create a question that involves analyzing or breaking down the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Evaluating": (
#         "Create a question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Creating": (
#         "Create a question that involves generating new ideas based on the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     )
# }
#
# def generate_question(level, context):
#     prompt = prompts[level].format(context=context)
#
#     try:
#         response = client.chat.completions.create(
#             model="jamba-1.5-mini",
#             messages=[
#                 ChatMessage(
#                     role="user",
#                     content=prompt
#                 )
#             ],
#             documents=[],
#             tools=[],
#             n=1,
#             max_tokens=1024,
#             temperature=0.4,
#             top_p=1,
#             stop=[],
#             response_format=ResponseFormat(type="text")
#         )
#
#         # Accessing the response attributes directly
#         choice = response.choices[0]  # Accessing the first choice
#         message = choice.message  # Accessing the message
#         content = message.content  # Accessing the content of the message
#
#         return content
#     except Exception as e:
#         return f"An error occurred: {e}"
#
# # Choose a taxonomy level to generate a question
# selected_level = "Creating"  # Replace with the desired level
#
# # Generate and print the question for the selected level
# generated_question = generate_question(selected_level, context)
# print(f"Generated Question for {selected_level}:")
# print(generated_question)


# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# # Initialize the AI21 client with your API key
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"  # Replace with your actual API key
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "Now we are finally getting close to some technologies that resemble our current technology. The electromechanical age can be defined as the time between 1840 and 1940. These are the beginnings of telecommunication. The telegraph was created in the early 1800s. Morse code was created by Samuel Morse in 1835. The telephone (one of the most popular forms of communication ever) was created by Alexander Graham Bell in 1876. The first radio developed by Guglielmo Marconi in 1894. All of these were extremely crucial emerging technologies that led to big advances in the information technology field. The first large-scale automatic digital computer in the United States was the Mark 1 created by Harvard University around 1940. This computer was 8ft high, 50ft long, 2ft wide, and weighed 5 tons - HUGE. It was programmed using punch cards. How does your PC match up to this hunk of metal? It was from huge machines like this that people began to look at downsizing all the parts to first make them usable by businesses and eventually in your own home."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# def generate_question(level, context):
#     prompt = {
# 		"Remembering": (
# 			f"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
# 			f"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 			f"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 		),
#         "Understanding": f"Create a question that asks for an explanation of the following context: {context}",
#         "Applying": f"Create a question that requires applying the following context to a new situation: {context}",
#         "Analyzing": f"Create a question that involves analyzing or breaking down the following context: {context}",
#         "Evaluating": f"Create a question that requires evaluating or making a judgment based on the following context: {context}",
#         "Creating": f"Create a question that involves generating new ideas based on the following context: {context}"
#     }
#
#     try:
#         response = client.chat.completions.create(
#             model="jamba-1.5-mini",
#             messages=[
#                 ChatMessage(
#                     role="user",
#                     content=prompt[level]
#                 )
#             ],
#             documents=[],
#             tools=[],
#             n=1,
#             max_tokens=1024,
#             temperature=0.4,
#             top_p=1,
#             stop=[],
#             response_format=ResponseFormat(type="text")
#         )
#
#         # Accessing the response attributes directly
#         choice = response.choices[0]  # Accessing the first choice
#         message = choice.message  # Accessing the message
#         content = message.content  # Accessing the content of the message
#
#         print(f"Generated Question for {level}:")
#         print(content)
#         print("\n")
#     except Exception as e:
#         print(f"An error occurred: {e}")
#
# # Generate questions for all levels
# for level in taxonomy_levels:
#     generate_question(level, context)



# with dictionary


# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# # Initialize the AI21 client with your API key
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"  # Replace with your actual API key
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = ("A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider. ")
#
#
# 	# Bloom's Taxonomy levels
# taxonomy_levels = {
# 	"Remembering": "Recall basic facts and concepts.",
# 	"Understanding": "Explain ideas or concepts.",
# 	"Applying": "Use information in new situations.",
# 	"Analyzing": "Draw connections among ideas.",
# 	"Evaluating": "Justify a decision or course of action.",
# 	"Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
# 	"Remembering": (
# 		"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Understanding": (
# 		"Create a question that asks for an explanation of the following context: {context}"
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Applying": (
# 		"Create a question that requires applying the following context to a new situation: {context}"
# 		"Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 		"Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#
# 	),
# 	"Analyzing": ("Create a question that involves analyzing or breaking down the following context: {context}"
# 				  "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				  "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Evaluating": ("Create a question that requires evaluating or making a judgment based on the following context: {context}"
# 				   "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				   "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 	),
# 	"Creating": ("Create a question that involves generating new ideas based on the following context: {context}"
# 				 "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
# 				 "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
# 				 )
# }
#
# # Dictionary to hold generated questions and answers
# generated_questions = {}
#
#
# def generate_question(level, context):
# 	prompt = prompts[level].format(context=context)
#
# 	try:
# 		response = client.chat.completions.create(
# 			model="jamba-1.5-mini",
# 			messages=[
# 				ChatMessage(
# 					role="user",
# 					content=prompt
# 				)
# 			],
# 			documents=[],
# 			tools=[],
# 			n=1,
# 			max_tokens=1024,
# 			temperature=0.4,
# 			top_p=1,
# 			stop=[],
# 			response_format=ResponseFormat(type="text")
# 		)
#
# 		# Accessing the response attributes directly
# 		choice = response.choices[0]  # Accessing the first choice
# 		message = choice.message  # Accessing the message
# 		content = message.content  # Accessing the content of the message
#
# 		# Store the generated question and answers in the dictionary
# 		generated_questions[level] = content
# 	except Exception as e:
# 		generated_questions[level] = f"An error occurred: {e}"
#
#
# # Generate questions for all levels
# for level in taxonomy_levels:
# 	generate_question(level, context)
#
# # Print the generated questions and answers
# for level, question in generated_questions.items():
# 	print(f"Generated Question for {level}:")
# 	print(question)
# 	print("\n")


# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
#     "Remembering": (
#         "Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     ),
#     "Understanding": (
#         "Create a multiple-choice question that asks for an explanation of the following context: {context}. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     ),
#     "Applying": (
#         "Create a multiple-choice question that requires applying the following context to a new situation: {context}. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     ),
#     "Analyzing": (
#         "Create a multiple-choice question that involves analyzing or breaking down the following context: {context}. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     ),
#     "Evaluating": (
#         "Create a multiple-choice question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     ),
#     "Creating": (
#         "Create a multiple-choice question that involves generating new ideas based on the following context: {context}. "
#         "Always provide a question followed by four answer options in a list format: "
#         "the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. "
#         "The question and the correct answer should be explicitly connected to the "
#         "information in the context: {context}"
#     )
# }
#
#
# def generate_question(level, context):
#     prompt = prompts[level].format(context=context)
#
#     try:
#         response = client.chat.completions.create(
#             model="jamba-1.5-mini",
#             messages=[
#                 ChatMessage(
#                     role="user",
#                     content=prompt
#                 )
#             ],
#             documents=[],
#             tools=[],
#             n=1,
#             max_tokens=1024,
#             temperature=0.4,
#             top_p=1,
#             stop=[],
#             response_format=ResponseFormat(type="text")
#         )
#
#         # Accessing the response attributes directly
#         choice = response.choices[0]
#         message = choice.message
#         content = message.content.strip()
#
#         # Debug: Print the raw content to diagnose issues
#         print(f"Raw Content:\n{content}\n")
#
#         # Process the content
#         lines = content.split('\n')
#
#         # Check if the response has at least 5 lines (1 question + 4 options)
#         if len(lines) >= 5:
#             question = lines[0].strip()
#             correct_answer = lines[2].strip()
#             distractors = [line.strip() for line in lines[3:]]  # Expecting exactly 3 distractors
#
#             # Create a dictionary to store the question, correct answer, and distractors
#             question_dict = {
#                 "question": question,
#                 "correct_answer": correct_answer,
#                 "distractors": distractors
#             }
#
#             return question_dict
#         else:
#             # Handle unexpected format or missing lines
#             return {"error": "Unexpected response format. Please try again."}
#
#     except Exception as e:
#         return {"error": str(e)}
#
#
# # Choose a taxonomy level to generate a question
# selected_level = "Remembering"  # Replace with the desired level
#
# # Generate the question, correct answer, and distractors
# question_info = generate_question(selected_level, context)
#
# # Print the generated question information
# print(f"Generated Question Information for {selected_level}:")
# print(question_info)
#
# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
#     # "Remembering": (
#     #     f"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context:{context}.with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#     #     "Output the question immediately without any introductory words"
#     #     "Do not use any indicator letters or numbers for answer and distractors"
#     # ),
#     "Remembering": (
#           f"Generate a straightforward multiple-choice question that tests the recall of specific facts, terms, or concepts directly stated in the following context: {context}. "
#           "Immediately follow the question with four answer options, where the first option is the correct answer. "
#           "Do not use any indicator letters or numbers for answer and distractors"
#     ),
#
#     "Understanding": (
#         f"Create a question that asks for an explanation of the following context:{context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Applying": (
#         "Create a question that requires applying the following context to a new situation: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Analyzing": (
#         "Create a question that involves analyzing or breaking down the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Evaluating": (
#         "Create a a multiple-choice question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Creating": (
#         "Create a a multiple-choice question that involves creating new ideas based on the following context: {context} with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#         "Output the question immediately without any introductory words"
#         "Do not use any indicator letters or numbers for answer and distractors"
#     )
# }
#
# def generate_question(level, context, max_retries=5):
#     prompt = prompts[level].format(context=context)
#     retry_count = 0
#
#     while retry_count < max_retries:
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
#                 temperature=0.4,
#                 top_p=1,
#                 stop=[],
#                 response_format=ResponseFormat(type="text")
#             )
#
#             # Access the response content
#             content = response.choices[0].message.content.strip()
#
#             # Process the content by splitting into lines and stripping any extra spaces
#             lines = [line.strip() for line in content.split('\n') if line.strip()]
#
#             # Validate and ensure we have a question and at least 4 options
#             if len(lines) < 5:
#                 retry_count += 1
#                 continue  # Retry if the response was incomplete
#
#             question = lines[0]  # Question is the first line
#             correct_answer = lines[1]  # First option is the correct answer
#             distractors = lines[2:5]  # Next three options are distractors
#
#             # Create a dictionary to store the question, correct answer, and distractors
#             question_dict = {
#                 "question": question,
#                 "correct_answer": correct_answer,
#                 "distractors": distractors
#             }
#
#             return question_dict
#         except Exception as e:
#             retry_count += 1
#
#     return {"error": "Failed to generate a valid question after multiple attempts."}
#
# # Choose a taxonomy level to generate a question
# selected_level = "Remembering"  # Replace with the desired level
#
# # Generate the question, correct answer, and distractors
# question_info = generate_question(selected_level, context)
#
# # Print the generated question information
# print(f"Generated Question Information for {selected_level}:")
# print(question_info)


# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
# import re
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = (
#     "A mobile service provider, sometimes called a wireless data provider, is an ISP that offers wireless Internet access to computers and mobile devices with the necessary built-in wireless capability, wireless modems, or other communications devices that enable wireless connectivity. An Antenna on or built into the computer or device, wireless modem, or communications device typically sends signals through the airwaves to communicate with a mobile service provider."
# )
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
#     "Remembering": (
#         f"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context:{context}.with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#         "Output the question immediately without any introductory words"
#         "Do not use any indicator letters or numbers for answer and distractors"
#     ),
#     "Remembering": (
#           f"Generate a straightforward multiple-choice question that tests the recall of specific facts, terms, or concepts directly stated in the following context: {context}.with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#         "Output the question immediately without any introductory words"
#
#
#     ),
#
#     "Understanding": (
#         f"Create a question that asks for an explanation of the following context:{context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Applying": (
#         "Create a question that requires applying the following context to a new situation: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Analyzing": (
#         "Create a question that involves analyzing or breaking down the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Evaluating": (
#         "Create a a multiple-choice question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them. The question and the correct answer should be explicitly connected to the information in the context: {context}"
#     ),
#     "Creating": (
#         "Create a a multiple-choice question that involves creating new ideas based on the following context: {context} with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#         "Output the question immediately without any introductory words"
#         "Do not use any indicator letters or numbers for answer and distractors"
#     )
# }
#
#
# def generate_question(level, context):
#     prompt = prompts[level].format(context=context)
#
#     while True:
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
#                 temperature=0.4,
#                 top_p=1,
#                 stop=[],
#                 response_format=ResponseFormat(type="text")
#             )
#
#             # Accessing the response attributes directly
#             choice = response.choices[0]  # Accessing the first choice
#             message = choice.message  # Accessing the message
#             content = message.content  # Accessing the content of the message
#
#             # Process the content to remove any numbers, letters, or asterisks from the answer options
#             lines = [re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip()) for line in
#                      content.strip().split('\n')]
#
#             # Separate the question and answers
#             question = lines[0]  # The first line is the question
#             correct_answer = lines[2]  # First option as the correct answer
#             distractors = lines[3:]  # Remaining lines are distractors
#
#             # Create a dictionary to store the question, correct answer, and distractors
#             question_dict = {
#                 "question": question,
#                 "correct_answer": correct_answer,
#                 "distractors": distractors
#             }
#
#             return question_dict
#         except Exception as e:
#             # Retry if an error occurs
#             print(f"An error occurred: {e}. Retrying...")
#
#
# # Choose a taxonomy level to generate a question
# selected_level = "Remembering"  # Replace with the desired level
#
# # Generate the question, correct answer, and distractors
# question_info = generate_question(selected_level, context)
#
# # Print the generated question information
# print(f"Generated Question Information for {selected_level}:")
# print(question_info)

#
# import os
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage, ResponseFormat
# import re
# import time
#
# api_key = "psXbkP0lnnojkAVlf9Y1AR7yQlD4uuZW"
# client = AI21Client(api_key=api_key)
#
# # Define the context
# context = ("Routers help you to connect with multiple networks. It enables you to share a single internet connection with multiple devices and saves money. This networking component acts as a dispatcher,which allows you to analyze data sent across a network. It automatically selects the best route fordata to travel and send it on its way.")
#
#
#
#
# # Bloom's Taxonomy levels
# taxonomy_levels = {
#     "Remembering": "Recall basic facts and concepts.",
#     "Understanding": "Explain ideas or concepts.",
#     "Applying": "Use information in new situations.",
#     "Analyzing": "Draw connections among ideas.",
#     "Evaluating": "Justify a decision or course of action.",
#     "Creating": "Generate new ideas or products."
# }
#
# # Define prompts for each taxonomy level
# prompts = {
#     "Remembering": (
#         f"Create a multiple-choice question that tests the recall of specific facts, names, dates, or concepts directly mentioned in the following context:{context}."
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them."
#         "Output the question immediately without any introductory words."
#     ),
#     "Understanding": (
#         f"Create a question that asks for an explanation of the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them."
#         "Output the question immediately without any introductory words."
#     ),
#     "Applying": (
#         f"Create a question that requires applying the following context to a new situation: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them."
#          "Output the question immediately without any introductory words."
#     ),
#     "Analyzing": (
#         f"Create a question that involves analyzing or breaking down the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them."
#         "Output the question immediately without any introductory words."
#     ),
#     "Evaluating": (
#         f"Create a multiple-choice question that requires evaluating or making a judgment based on the following context: {context}. "
#         "Provide a question followed by four answer options in a list format: the correct answer first, followed by three plausible but incorrect options. "
#         "Ensure the options are in plain text without any labels (like letters or numbers) before them."
#         "Output the question immediately without any introductory words."
#     ),
#     "Creating": (
#         f"Create a multiple-choice question that involves generating new ideas based on the following context: {context}. with four answer options in a list format: the first choice should be the correct answer, followed by three plausible but incorrect options. "
#         "Output the question immediately without any introductory words"
#         "Do not use any indicator letters or numbers for answer and distractors"
#
#     )
# }
#
# def generate_question(level, context):
#     prompt = prompts[level].format(context=context)
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
#                 temperature=0.4,
#                 top_p=1,
#                 stop=[],
#                 response_format=ResponseFormat(type="text")
#             )
#
#             # Accessing the response attributes directly
#             choice = response.choices[0]  # Accessing the first choice
#             message = choice.message  # Accessing the message
#             content = message.content  # Accessing the content of the message
#
#             # Process the content to remove any numbers, letters, or asterisks from the answer options
#             lines = [re.sub(r'^[\d\.\)\*]*(?:[A-Da-d][\.\)])?\s*', '', line.strip()) for line in content.strip().split('\n')]
#
#             # Ensure the question and answers are not empty
#             if len(lines) < 4:
#                 raise ValueError("The generated content does not have enough lines for a valid question and answers.")
#
#             # Separate the question and answers
#             question = lines[0]  # The first line is the question
#             correct_answer = lines[2]  # The second line as the correct answer
#             distractors = [line for line in lines[3:] if line]  # Filter out empty distractors
#
#             # Create a dictionary to store the question, correct answer, and distractors
#             question_dict = {
#                 "question": question,
#                 "correct_answer": correct_answer,
#                 "distractors": distractors
#             }
#
#             return question_dict
#
#         except Exception as e:
#             retries += 1
#             wait_time = 2 ** retries  # Exponential backoff
#             print(f"An error occurred: {e}. Retrying in {wait_time} seconds...")
#             time.sleep(wait_time)  # Wait before retrying
#
#     raise RuntimeError("Failed to generate a valid question after several attempts.")
#
# # Choose a taxonomy level to generate a question
# selected_level = "Remembering"  # Replace with the desired level
#
# # Generate the question, correct answer, and distractors
# question_info = generate_question(selected_level, context)
#
# # Print the generated question information
# print(context)
# print(f"Generated Question Information for {selected_level}:")
# print(question_info)






import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat
import re
import time
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

