from openai import OpenAI


v3apikey="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"
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", 
    "X-Title": "<YOUR_SITE_NAME>",
  },
  extra_body={},
  model="deepseek/deepseek-r1-0528:free",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life? make a 1 muliple choice question based on this question"
    }
  ]
)

print(completion.choices[0].message.content)
# Print total tokens used
if hasattr(completion, "usage"):
    print("Total tokens used:", completion.usage.total_tokens)
    print("Total tokens used:", completion.usage)
else:
    print("Token usage info not available.")



