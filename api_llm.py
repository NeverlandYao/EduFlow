import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "gpt-3.5-turbo"

@app.get("/")
async def root():
    return {"message": "LLM API is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    # This is a mock response. In a real application, you would call OpenAI or another LLM here.
    # from openai import OpenAI
    # client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    # response = client.chat.completions.create(model=request.model, messages=request.messages)
    # return {"content": response.choices[0].message.content}
    
    last_message = request.messages[-1].content
    return {
        "role": "assistant",
        "content": f"Echo: {last_message}. (This is a mock response from api_llm.py)"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
