# LLM 聊天机器人项目

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
├── main.py
├── README.md
├── requirements.txt
└── static
    ├── index.html
    ├── css
    │   └── style.css
    └── js
        └── chat.js
```

### 主要文件说明

- **.env.local**: 存储环境变量，如 OpenAI API 密钥等。
- **main.py**: 后端主程序，包含 FastAPI 应用和 API 定义。
- **static/index.html**: 前端页面，提供用户界面。
- **static/css/style.css**: 样式文件，用于美化前端界面。
- **static/js/chat.js**: 前端 JavaScript 代码，处理用户输入和显示 AI 响应。
- **requirements.txt**: 项目依赖列表。

## 运行项目

1. 安装依赖包：

   ```bash
   pip install -r requirements.txt
   ```

2. 设置环境变量：
   在 `.env` 文件中设置以下环境变量：

   ```env
   OPENAI_API_KEY=你的OpenAI API密钥
   OPENAI_BASE_URL=https://api.openai.com/v1  # 如果有自定义 base_url
   OPENAI_MODEL=gpt-3.5-turbo  # 可选，默认为 gpt-3.5-turbo
   ```

3. 运行项目：

   ```bash
   uvicorn main:app --reload
   ```

4. 访问应用：
   打开浏览器并访问 `http://localhost:8000` 即可与 AI 助手进行交互。

## 功能说明

- **主页**: 提供一个简单的聊天界面，用户可以输入消息并与 AI 助手进行对话。
- **流式响应**: 使用 SSE (Server-Sent Events) 实现流式响应，实时显示 AI 的回复。

## 贡献

欢迎提交问题和拉取请求！如果你有任何改进建议或发现错误，请随时联系我。

## License

本项目采用 MIT 许可证。详见 LICENSE 文件。
