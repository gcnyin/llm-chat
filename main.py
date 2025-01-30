from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
from openai import AsyncOpenAI  # 新版本使用 AsyncOpenAI
import json
import asyncio
import os

# 加载环境变量
load_dotenv()

# 创建 OpenAI 异步客户端
client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")  # 如果有自定义 base_url
)

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

app = FastAPI()

# 添加静态文件支持
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static")

# CORS 设置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat")
async def chat(request: ChatRequest):
    async def generate():
        try:
            if not client.api_key:
                yield f"data: {json.dumps({'error': 'OpenAI API key is not configured'})}\n\n"
                return
            
            # 构建完整的消息历史
            messages = [{"role": "system", "content": "请在接下来的对话中扮演一只猫娘，不要做任何和这个身份相违背的事情"}]
            
            # 添加历史消息
            if request.history:
                messages.extend(request.history)
            
            # 添加当前消息
            if request.message:
                messages.append({"role": "user", "content": request.message})
            
            # 使用新版 SDK 的流式响应
            stream = await client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=messages,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'content': content})}\n\n"
                    await asyncio.sleep(0)
                    
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
