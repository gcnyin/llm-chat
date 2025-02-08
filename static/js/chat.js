// 创建 markdown-it 实例
const md = window.markdownit();

// 全局变量
let currentMessageContent = ''; // 存储当前 AI 消息的内容
let currentMessageDiv = null; // 存储当前 AI 消息的 DOM 元素
let messageHistory = []; // 存储消息历史记录

// 添加消息到界面
/**
 * 将消息添加到聊天界面
 * @param {string} sender 发送者 (例如: "您" 或 "AI")
 * @param {string} message 消息内容
 * @param {string} className 消息的 CSS 类名 (例如: "user-message" 或 "ai-message")
 * @returns {HTMLElement} 创建的消息 DOM 元素
 */
function addMessage(sender, message, className) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message} <button class="copy-button" onclick="copyMessage(this)">📋</button>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
}

// 发送消息
/**
 * 发送用户消息并获取 AI 的回复
 */
async function sendMessage() {
    const input = document.getElementById('user-input');
    const loading = document.getElementById('loading');
    const message = input.value.trim();

    if (!message) return;

    try {
        // 添加用户消息到历史记录
        messageHistory.push({
            role: "user",
            content: message
        });

        // 显示用户消息
        addMessage('您', message, 'user-message');
        input.value = '';

        // 显示加载动画
        loading.style.display = 'block';
        currentMessageContent = '';

        // 创建 AI 响应的消息框
        currentMessageDiv = document.createElement('div');
        currentMessageDiv.className = 'message ai-message';
        currentMessageDiv.innerHTML = '<strong>AI:</strong> <div class="markdown-body"></div>';
        document.getElementById('chat-messages').appendChild(currentMessageDiv);

        // 发送请求
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: messageHistory
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const lines = text.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(5));

                        if (data.error) {
                            loading.style.display = 'none';
                            addMessage('系统', '发生错误: ' + data.error, 'error-message');
                            return;
                        }

                        if (data.content) {
                            let content = data.content;
                            console.log('Received content:', content);
                            console.log('Type of content:', typeof content);
                            if (typeof content === 'object' && content !== null && content.hasOwnProperty('content')) {
                                currentMessageContent += content.content;
                                console.log('Updated currentMessageContent (object):', currentMessageContent);
                            } else if (typeof content === 'string') {
                                console.log('Before markdown-it render:', currentMessageContent);
                                currentMessageContent += content;
                                console.log('Updated currentMessageContent (string):', currentMessageContent);
                                if (typeof currentMessageContent !== 'string') {
                                    console.error('currentMessageContent is not a string:', typeof currentMessageContent);
                                } else {
                                    // 使用 markdown-it 解析内容
                                    const markdownContent = md.render(currentMessageContent);
                                    console.log('After markdown-it render:', markdownContent);
                                    currentMessageDiv.querySelector('.markdown-body').innerHTML = markdownContent;
                                }
                            } else {
                                console.error('Unexpected content type:', typeof content);
                            }

                            // 更新显示
                            const markdownContent = md.render(currentMessageContent);
                            currentMessageDiv.querySelector('.markdown-body').innerHTML = markdownContent;

                            // 高亮代码块
                            currentMessageDiv.querySelectorAll('pre code').forEach((block) => {
                                if (!block.classList.contains('hljs')) {
                                    hljs.highlightElement(block);
                                }
                            });

                            // 滚动到底部
                            const chatMessages = document.getElementById('chat-messages');
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e);
                    }
                }
            }
        }

        // 将 AI 的完整回复添加到历史记录
        messageHistory.push({
            role: "assistant",
            content: currentMessageContent
        });

        // 将复制按钮添加到 currentMessageDiv
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerText = '📋';
        copyButton.onclick = function() { copyMessage(this); };
        currentMessageDiv.appendChild(copyButton);

    } catch (error) {
        loading.style.display = 'none';
        addMessage('系统', '网络错误,请重试', 'error-message');
        console.error('Error:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// 复制消息
/**
 * 复制消息内容到剪贴板
 * @param {HTMLButtonElement} button 点击的复制按钮
 */
function copyMessage(button) {
    const messageText = button.parentNode.innerText.replace('复制', '').trim();
    navigator.clipboard.writeText(messageText)
        .then(() => {
            // 可选:复制成功后的提示
            button.innerText = '已复制';
            setTimeout(() => {
                button.innerText = '复制';
            }, 2000);
        })
        .catch(err => {
            console.error('复制失败: ', err);
            alert('复制失败,请手动复制。');
        });
}

// 当 DOM 加载完成后添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // 添加键盘事件监听
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 添加按钮点击事件监听
    sendButton.addEventListener('click', sendMessage);
});

// 可选的本地存储功能
/**
 * 保存消息历史记录到本地存储
 */
function saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
}

/**
 * 从本地存储加载消息历史记录
 */
function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        messageHistory = JSON.parse(savedHistory);
    }
}