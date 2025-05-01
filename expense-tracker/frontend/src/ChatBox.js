import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatBox.css";

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const userId = "user_001"; // Static user ID for now

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            // const response = await axios.get(`http://127.0.0.1:5000/chat-history/${userId}`);
            const response = await axios.get(`https://pet-7r7h.onrender.com/chat-history/${userId}`);
            const chatHistory = response.data.flatMap(chat => [
                { text: chat.user_message, sender: "user" },
                { text: chat.ai_response, sender: "bot" }
            ]);
            setMessages(chatHistory);
        } catch (error) {
            console.error("🚨 Error fetching chat history:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/chat", {
                user_id: userId,
                message: currentInput
            });

            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("❌ Chat request failed:", error);
            setMessages(prev => [...prev, { text: "⚠️ Error fetching response", sender: "bot" }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chat-container">
            <div className="chat-header">💬 AI Chat Assistant</div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask anything..."
                />
                <button onClick={sendMessage}>✉️</button>
            </div>
        </div>
    );
}

export default ChatBox;
