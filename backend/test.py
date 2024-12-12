import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat,DocumentSchema
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
max_tokens = 1024

objectives_string = """ Explain what a feasibility analysis is and why it’s important;
 Discuss the proper time to complete a feasibility analysis when developing an
entrepreneurial venture;
 Describe the purpose of a product/service feasibility analysis and the two primary issues that
a proposed business should consider in this area;
 Explain a concept statement and its components;
 Describe the purpose of a buying intentions survey and how it’s administered;
 Explain the importance of library, Internet, and gumshoe research;
 Describe the purpose of industry/market feasibility analysis and the two primary issues to
consider in this area;
 Discuss the characteristics of an attractive industry;
 Describe the purpose of organizational feasibility analysis and list the two primary issues to
consider in this area;
 Explain the importance of financial feasibility analysis and list the most critical issues to
consider in this area."""


# objective_count = "Be consistent. Identify how many learning objectives are in this context: {}. Only respond with a number nothing else"
objective_count = "Make each of these learning outcomes to be in theri own single line:{}. Only respond with the modified learning outcomes nothing else"
prompt =  objective_count.format(objectives_string)


            # API call to OpenAI or the client
response = client.chat.completions.create(
                model="jamba-1.5-mini",
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
# Single string containing all topics

# Split the string into a list based on line breaks
topics_array = content.split("\n")

# Print the resulting list
for i, topic in enumerate(topics_array, start=1):
    print(f"{i}. {topic}")



print(topics_array)

