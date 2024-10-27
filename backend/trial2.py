
#pag walang laman na pdf
import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat, DocumentSchema, FunctionToolDefinition, ToolDefinition, ToolParameters

client = AI21Client(api_key=os.environ.get("AI21_API_KEY"))
client.chat.completions.create(
		model="jamba-1.5-large",
		messages=[],
		documents=[],
		tools=[],
		n=1,
		max_tokens=2048,
		temperature=0.4,
		top_p=1,
		stop=[],
		response_format=ResponseFormat(type="text"),
)

#pag may laman na pdf

import os
from ai21 import AI21Client
from ai21.models.chat import ChatMessage, ResponseFormat, DocumentSchema, FunctionToolDefinition, ToolDefinition, ToolParameters

client = AI21Client(api_key=os.environ.get("AI21_API_KEY"))
client.chat.completions.create(
		model="jamba-1.5-large",
		messages=[],
		documents=[
			DocumentSchema(
  				id="2d2a68b2-3832-4519-8dc6-b8fb20c2860c",
  				content= "dito yung buong laman ng pdf na naextract"  )
		],
		tools=[],
		n=1,
		max_tokens=2048,
		temperature=0.4,
		top_p=1,
		stop=[],
		response_format=ResponseFormat(type="text"),
)