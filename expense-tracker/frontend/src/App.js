import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import AuthContext, { AuthProvider } from "./AuthContext";
import HomePage from "./Home";
import SpendingChart from "./SpendingChart";
// import ChatBox from "./ChatBox";
import AboutUs from "./AboutUs";
import Login from "./Login";
import Signup from "./SignUp";
import "./Home.css";
import "typeface-roboto";
import ReportFraud from "./ReportFraud";
import FraudReports from "./FraudReports";

function ProtectedRoute({ element }) {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/" />;
}

function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <Link to="/HomePage">Home</Link> | 
            <Link to="/spending-chart">Spending Chart</Link> |
            {/* <Link to="/chatbot">Chat with AI</Link> | */}
            {/* <Link to="/report-fraud">Report Fraud</Link> | */}
            <Link to="/fraud-reports">View Reports</Link> |
            <Link to="/about">About Us</Link> |
            {!user && <Link to="/signup">Sign Up</Link>} |{/* Hide Sign Up */}
            {!user && <Link to="/">Login</Link>} {/* Hide Login */}
        </nav>
    );
}

function LogoutButton() {
    const { user, logout } = useContext(AuthContext);

    return (
        user && (
            <button onClick={logout} className="logout-button">
                Logout
            </button>
        )
    );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Navbar />
          <LogoutButton /> {/* Separate Logout button at the top-right */}
          <Routes>
            <Route path="/HomePage" element={<ProtectedRoute element={<HomePage />} />} />
            <Route path="/spending-chart" element={<ProtectedRoute element={<SpendingChart />} />} />
            <Route path="/report-fraud/:id" element={<ProtectedRoute element={<ReportFraud />} />} />
            <Route path="/fraud-reports" element={<ProtectedRoute element={<FraudReports />} />} />
            {/* <Route path="/chatbot" element={<ProtectedRoute element={<ChatBox />} />} /> */}
            <Route path="/about" element={<ProtectedRoute element={<AboutUs />} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
