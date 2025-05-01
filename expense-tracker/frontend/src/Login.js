import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import "./Auth.css";

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { email, password });

            if (response.data.success) {
                login(response.data.user);
                navigate("/HomePage");
                alert("Login successfully! Welcome back!"); // Redirect to home after login
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("🚨 Login failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>
        </div>
    );
}

export default Login;
