import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook to navigate to other pages

    const handleSignup = async () => {
        try {
            // const response = await axios.post("http://127.0.0.1:5000/signup", { name, email, password });
            const response = await axios.post("https://pet-7r7h.onrender.com/signup", { name, email, password });
            if (response.data.success) {
                setMessage("✅ Signup successful! Redirecting to login...");
                setTimeout(() => navigate("/"), 2000); 
            } else {
                setMessage("❌ " + response.data.message);
            }
        } catch (error) {
            setMessage("🚨 Signup failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Signup</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Signup</button>
            <p>{message}</p>
        </div>
    );
}

export default Signup;
