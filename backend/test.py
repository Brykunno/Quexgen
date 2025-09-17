import pdfplumber
from ai21 import AI21Client, ChatMessage, ResponseFormat
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS


api_key = "f197bb64-d6d1-42f9-b5f5-a2278bf08c9d"
client = AI21Client(api_key=api_key)
# --- Step 1: Extract text from PDF with pdfplumber ---
def load_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

pdf_text = load_pdf("TECH101_Module1_updated.pdf")

# --- Step 2: Split text into chunks ---
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)
docs = splitter.create_documents([pdf_text])

# --- Step 3: Create embeddings and store in FAISS ---
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = FAISS.from_documents(docs, embeddings)
retriever = db.as_retriever(search_kwargs={"k": 5})

# --- Step 4: Retrieve context from vector DB ---
query = "Generate 20 questions about this document"
retrieved_chunks = retriever.get_relevant_documents(query)
context = "\n".join([doc.page_content for doc in retrieved_chunks])

# --- Step 5: Send context + query to Jamba ---
prompt = f"""
You are a question generator. Based on the following document context, create 20 thoughtful questions.

Context:
{context}

Questions:
"""

client = AI21Client()

response = client.chat.completions.create(
    model="jamba-large-1.7",
    messages=[
        ChatMessage(role="user", content=prompt)
    ],
    n=1,
    max_tokens=800,
    temperature=0.7,
    top_p=1,
    response_format=ResponseFormat(type="text")
)

print(response.choices[0].message.content)
