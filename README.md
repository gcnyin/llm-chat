# LLM Chatbot Project / LLM 聊天机器人项目

## Project Overview

This is a chatbot project based on FastAPI and the OpenAI API. Users can interact with the AI assistant through a web interface.

## Tech Stack

- **Backend**: FastAPI
- **Frontend**: HTML, CSS, JavaScript
- **Dependencies**:
  - `aiohttp` for asynchronous HTTP requests
  - `fastapi` for building the API
  - `jinja2` for template rendering
  - `openai` for interacting with the OpenAI API
  - `pydantic` for data validation
  - `python-dotenv` for managing environment variables
  - `uvicorn` for running the ASGI server

## Project Structure

```shell
.
├── .env.local
├── .gitignore
├── LICENSE
├── main.py
├── README.md
├── requirements.txt
├── run.sh
└── static
    ├── index.html
    ├── css
    │   └── style.css
    └── js
        └── chat.js
```

### Key File Descriptions

- **.env.local**: Stores environment variables, such as the OpenAI API key.
- **main.py**: The backend main program, containing the FastAPI application and API definitions.
- **static/index.html**: The frontend page, providing the user interface.
- **static/css/style.css**: The style file, used to beautify the frontend interface.
- **static/js/chat.js**: Frontend JavaScript code, handling user input and displaying AI responses.
- **requirements.txt**: Project dependency list.
- **run.sh**: The script for running the project.

## Running the Project

1. Create a `.env` file based on the `.env.local` file and update the corresponding values. For example:

    ```bash
    cp .env.local .env
    ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   Set the following environment variables in the `.env` file (if not already set):

   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_BASE_URL=https://api.openai.com/v1  # If you have a custom base_url
   OPENAI_MODEL=gpt-3.5-turbo  # Optional, defaults to gpt-3.5-turbo
   ```

4. Run the project:

   ```bash
   ./run.sh
   ```

5. Access the application:
   Open a browser and visit `http://localhost:8000` to interact with the AI assistant.

## Functionality

- **Homepage**: Provides a simple chat interface where users can enter messages and have conversations with the AI assistant.
- **Streaming Response**: Uses SSE (Server-Sent Events) to implement streaming responses, displaying the AI's replies in real-time.

## Contributing

Welcome to submit issues and pull requests! If you have any suggestions for improvement or find any errors, please feel free to contact me.

## License

This project uses the MIT license. See the LICENSE file for details.

## 项目概述

这是一个基于 FastAPI 和 OpenAI API 的聊天机器人项目。用户可以通过 Web 界面与 AI 助手进行交互。

## 技术栈

- **后端**: FastAPI
- **前端**: HTML, CSS, JavaScript
- **依赖库**:
  - `aiohttp` 用于异步 HTTP 请求
  - `fastapi` 用于构建 API
  - `jinja2` 用于模板渲染
  - `openai` 用于与 OpenAI API 交互
  - `pydantic` 用于数据验证
  - `python-dotenv` 用于管理环境变量
  - `uvicorn` 用于运行 ASGI 服务器

## 项目结构

```shell
.
├── .env.local
├── .gitignore
├── LICENSE
├── main.py
├── README.md
├── requirements.txt
├── run.sh
└── static
    ├── index.html
    ├── css
    │   └── style.css
    └── js
        └── chat.js
```

### 主要文件说明

- **.env.local**: 存储环境变量,如 OpenAI API 密钥等。
- **main.py**: 后端主程序,包含 FastAPI 应用和 API 定义。
- **static/index.html**: 前端页面,提供用户界面。
- **static/css/style.css**: 样式文件,用于美化前端界面。
- **static/js/chat.js**: 前端 JavaScript 代码,处理用户输入和显示 AI 响应。
- **requirements.txt**: 项目依赖列表。
- **run.sh**: 运行项目的脚本。

## 运行项目

1. 根据 `.env.local` 文件创建 `.env` 文件,并更新对应的值。例如:

    ```bash
    cp .env.local .env
    ```

2. 安装依赖包:

   ```bash
   pip install -r requirements.txt
   ```

3. 设置环境变量:
   在 `.env` 文件中设置以下环境变量(如果还没有设置):

   ```env
   OPENAI_API_KEY=你的OpenAI API密钥
   OPENAI_BASE_URL=https://api.openai.com/v1  # 如果有自定义 base_url
   OPENAI_MODEL=gpt-3.5-turbo  # 可选,默认为 gpt-3.5-turbo
   ```

4. 运行项目:

   ```bash
   ./run.sh
   ```

5. 访问应用:
   打开浏览器并访问 `http://localhost:8000` 即可与 AI 助手进行交互。

## 功能说明

- **主页**: 提供一个简单的聊天界面,用户可以输入消息并与 AI 助手进行对话。
- **流式响应**: 使用 SSE (Server-Sent Events) 实现流式响应,实时显示 AI 的回复。

## 贡献

欢迎提交问题和拉取请求!如果你有任何改进建议或发现错误,请随时联系我。

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。
