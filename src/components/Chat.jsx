import './Chat.css';
import { useState } from 'react';

function Chat({ file }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    async function handleSendMessage() {
        if (input.length) {
            let chatMessages = [
                ...messages,
                { role: "user", text: input },
                { role: "loader", text: "" }
            ];
            setInput("");
            setMessages(chatMessages);

            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileType: file.type,
                        fileData: file.file,
                        question: input,
                        chatHistory: messages
                    }),
                });

                const data = await response.json();
                chatMessages = [
                    ...chatMessages.filter((msg) => msg.role !== 'loader'),
                    { role: "model", text: data.answer }
                ];
                setMessages(chatMessages);
            } catch (error) {
                chatMessages = [
                    ...chatMessages.filter((msg) => msg.role !== 'loader'),
                    { role: "error", text: "An error occurred" }
                ];
                setMessages(chatMessages);
            }
        }
    }

    return (
        <section className="chat-window">
            <h2>Chat</h2>
            {messages.length ? (
                <div className='chat'>
                    {messages.map((msg, index) => (
                        <div className={msg.role} key={index}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
            ) : ""}
            <div className="input-area">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text" 
                    placeholder="Ask any question about the uploaded document..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </section>
    );
}

export default Chat;
