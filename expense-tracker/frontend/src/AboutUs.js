import React from "react";
import "./AboutUs.css";

function AboutUs() {
    return (
        <div className="about-container">
            <h1>About Our Project</h1>
            <p>
                Welcome to the Expense Tracker AI Chatbot, a smart way to manage and analyze your transactions.
                This project is designed to help users track their spending and ask AI-based queries related to their financial data.
            </p>

            <h2>⭐ Key Features</h2>
            <ul>
                <li>📊 Visual Spending Analysis – View detailed breakdowns of your transactions with interactive charts.</li>
                <li>💬 AI Chatbot – Ask any question about your expenses and get instant AI-powered insights.</li>
                <li>🔎 Filtering & Sorting – Easily filter and sort transactions based on categories, amounts, and dates.</li>
                <li>🔐 Secure Data Storage – Transactions are stored in CouchDB, ensuring data persistence.</li>
                <li>🌍 User-Friendly Interface – A clean, responsive UI designed for both desktop and mobile users.</li>
            </ul>

            <h2>📈 How It Works</h2>
            <p>
                Users can add transactions, view spending patterns, and interact with an AI assistant to get insights
                about their financial habits. The chatbot is powered by OpenAI's GPT-4 and integrates with
                CouchDB for real-time data retrieval.
            </p>

            <h2>🖥️ Technologies Used</h2>
            <ul>
                <li>🔹 React.js – For building the front-end UI.</li>
                <li>🔹 Flask – Backend API that connects the chatbot to transaction data.</li>
                <li>🔹 CouchDB – NoSQL database for storing transaction records.</li>
                <li>🔹 OpenAI GPT-4 – AI-powered chatbot for answering user queries.</li>
                <li>🔹 Recharts – Used for generating spending analytics charts.</li>
            </ul>

            <h2>💡 Why We Built This</h2>
            <p>
                Managing expenses is very important for financial stability. This project helps users not only track their
                spending but also leverage AI to gain financial insights. Our goal is to create a smart, interactive,
                and user-friendly expense tracking system.
            </p>
            <h3>References 📌</h3>
            <p>
                For more information, please refer to the project documentation and the following resources:
                <li><a href="https://www.youtube.com/watch?v=q5HiD5PNuck">Create a Python GPT Chatbot - In Under 4 Minutes</a></li>
            </p>
            <h3>🔗 Explore More:</h3>
            <p>
                ➡ Go to <a href="/">Home</a> | <a href="/spending-chart">Spending Chart</a> | <a href="/chatbot">Chat with AI</a>
            </p>
            <div className="chat-footer">
                <p>© 2025 Team 2 Expense Tracker Project</p>
            </div>
        </div>
    );
}

export default AboutUs;
