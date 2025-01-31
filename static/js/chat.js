// 创建 markdown-it 实例
const md = window.markdownit();

// 全局变量
let currentMessageContent = '';
let currentMessageDiv = null;
let messageHistory = [];

// 添加消息到界面
function addMessage(sender, message, className) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
}

// 发送消息
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
        
    } catch (error) {
        loading.style.display = 'none';
        addMessage('系统', '网络错误，请重试', 'error-message');
        console.error('Error:', error);
    } finally {
        loading.style.display = 'none';
    }
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
function saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
}

function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        messageHistory = JSON.parse(savedHistory);
    }
}