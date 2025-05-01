import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "typeface-roboto";


function Home() {
    const [transactions, setTransactions] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [amountFilter, setAmountFilter] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [newTransaction, setNewTransaction] = useState({
        user_id: "USER_001",
        transaction_date: "2025-03-12",
        product_category: "Groceries",
        product_name: "Milk",
        merchant_name: "Walmart",
        product_amount: 5.99,
        payment_method: "Credit Card",
        transaction_status: "Successful",
        merchant_id: "MERCH_001",
        device_type: "Android",
        location: "Urban"
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        axios.get("http://127.0.0.1:5000/transactions")
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching data:", error));
    };

    const addTransaction = () => {
        // Ensure product amount is a number
        const transactionData = {
            ...newTransaction,
            product_amount: parseFloat(newTransaction.product_amount), 
        };
    
        axios.post("http://127.0.0.1:5000/transactions", transactionData)
            .then(response => {
                alert("Transaction added successfully!");
                fetchTransactions();  
            })
            .catch(error => {
                console.error("Error adding transaction:", error);
                alert("Failed to add transaction."); 
            });
    };

    const deleteTransaction = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (confirmDelete) {
            axios.delete(`http://127.0.0.1:5000/transactions/${id}`)
                .then(() => {
                    alert("Transaction deleted successfully!");
                    fetchTransactions();
                })
                .catch(error => console.error("Error deleting transaction:", error));
        } else {
            alert("Transaction deletion cancelled.");
        }
    };

    const filteredTransactions = transactions
        .filter(tx => categoryFilter ? tx.product_category.includes(categoryFilter) : true)
        .filter(tx => amountFilter ? tx.product_amount >= parseFloat(amountFilter) : true)
        .sort((a, b) => sortBy === "amount" ? b.product_amount - a.product_amount
            : sortBy === "date" ? new Date(b.transaction_date) - new Date(a.transaction_date)
            : 0);

    return (
        <div className="container">
            <h1>Expense Tracker</h1>

            <div className="filters">
                <label>Filter by Category: </label>
                <input type="text" onChange={e => setCategoryFilter(e.target.value)} />
                <label> Min Amount: </label>
                <input type="number" onChange={e => setAmountFilter(e.target.value)} /><br />
                <label> Sort by: </label>
                <select onChange={e => setSortBy(e.target.value)}>
                    <option value="">None</option>
                    <option value="amount">Amount</option>
                    <option value="date">Date</option>
                </select>
            </div>

            <h3>Add Transaction</h3>
            <input type="text" placeholder="Category" onChange={e => setNewTransaction(prev => ({ ...prev, product_category: e.target.value }))} /><br />
            <input type="number" placeholder="Amount" onChange={e => setNewTransaction(prev => ({ ...prev, product_amount: parseFloat(e.target.value) }))} /><br />
            <button onClick={addTransaction}>Add</button>

            <button onClick={() => navigate("/spending-chart")} style={{ marginLeft: "10px" }}>
                View Spending Chart
            </button>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Merchant ID</th>
                        <th>Category</th>
                        <th>Amount ($)</th>
                        <th>Cash Back ($)</th>
                        <th>Transaction Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map(tx => (
                        <tr key={tx._id}>
                            <td>{tx.transaction_id}</td>
                            <td>{tx.merchant_id}</td>
                            <td>{tx.product_category}</td>
                            <td>${tx.product_amount.toFixed(2)}</td>
                            <td>${tx.cashback.toFixed(2)}</td>
                            <td>{tx.transaction_date}</td>
                            <td>
                                <button onClick={() => deleteTransaction(tx._id)}>Delete</button>
                                <button onClick={() => navigate(`/report-fraud/${tx._id}`)}>Report Fraud</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="chat-footer">
                <p>© 2025 Team 2 Expense Tracker Project</p>
            </div>
        </div>
        
    );
}

export default Home;
