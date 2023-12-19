const express = require('express');
const fetch = require('node-fetch'); // Ensure node-fetch is installed
const app = express();
const port = 8081;

// Serve HTML content
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Code Genie 🪄</title>
        <style>
            body {
                font-family: sans-serif;
                margin: 0;
                padding: 0;
                height: 80vh;
                background-color: #f5f5f5;
            }
            .chat {
                display: flex;
                flex-direction: column;
                height: calc(100% - 100px);
                border-radius: 5px;
                padding: 10px;
                overflow-y: scroll;
            }
            .message {
                margin-bottom: 5px;
                padding: 5px;
                border-radius: 5px;
                display: flex;
                align-items: flex-start;
                gap: 5px;
            }
            .user-message {
                background-color: #eee;
                border-right: 3px solid #007bff;
            }
            .model-message {
                background-color: #f5f5f5;
                border-left: 3px solid #007bff;
            }
            .message-content {
                flex-grow: 1;
                font-size: 14px;
                white-space: pre-wrap;
            }
            .code-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                margin-bottom: 5px;
                resize: vertical;
                height: 50px;
            }
            .submit-button {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="chat"></div>
        <textarea class="code-input" placeholder="Ask your code question"></textarea>
        <button class="submit-button">Get Code Magic!</button>
        <script>
            const chatContainer = document.querySelector('.chat');
            const codeInput = document.querySelector('.code-input');
            const submitButton = document.querySelector('.submit-button');

            function escapeHtml(text) {
                return text.replace(/[&<>"']/g, function(match) {
                    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[match];
                });
            }

            submitButton.addEventListener('click', submitQuery);
            codeInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitQuery();
                }
            });

            function submitQuery() {
                const userMessage = escapeHtml(codeInput.value);
                if (!userMessage.trim()) return;

                const apiMessage = { role: "user", parts: [{ text: userMessage }] };

                fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "contents": [apiMessage] }),
                })
                .then(response => response.json())
                .then(data => {
                    const modelResponse = data.generatedContents[0].text;
                    displayMessage(modelResponse, 'model');
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                displayMessage(userMessage, 'user');
                codeInput.value = '';
            }

            function displayMessage(message, role) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(role === 'user' ? 'user-message' : 'model-message');
                const messageContent = document.createElement('span');
                messageContent.classList.add('message-content');
                messageContent.innerText = message;
                messageElement.appendChild(messageContent);
                chatContainer.appendChild(messageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        </script>
    </body>
    </html>`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
