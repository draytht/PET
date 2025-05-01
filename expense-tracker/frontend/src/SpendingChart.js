import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./SpendingChart.css";
import "typeface-roboto";


const COLORS = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"];

function SpendingChart() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get("category");

    const [transactions, setTransactions] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [showSpendingChart, setShowSpendingChart] = useState(true); // New state for Spending Chart
    const [showCashbackChart, setShowCashbackChart] = useState(true); // New state for Cashback Chart

    useEffect(() => {
        // axios.get("http://127.0.0.1:5000/transactions")
        axios.get("https://pet-7r7h.onrender.com/transactions")
            .then(response => {
                console.log("Fetched Transactions:", response.data);
                const filteredData = response.data.filter(tx => 
                    categoryFilter ? tx.product_category.includes(categoryFilter) : true
                );
                setTransactions(filteredData);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [categoryFilter]);

    useEffect(() => {
        if (transactions.length > 0) {
            processTransactionData(transactions);
        }
    }, [transactions]);

    const processTransactionData = (data) => {
        let total = 0;
        let categoryMap = {};
        let cashbackMap = {}; // To store cashback per category

        data.forEach(tx => {
            total += tx.product_amount;

            // Store spending per category
            categoryMap[tx.product_category] = (categoryMap[tx.product_category] || 0) + tx.product_amount;

            // Store cashback per category
            cashbackMap[tx.product_category] = (cashbackMap[tx.product_category] || 0) + (tx.cashback || 0);
        });

        setTotalSpent(total);

        // Generate breakdown for spending
        const breakdown = Object.keys(categoryMap).map(category => ({
            name: category,
            value: (categoryMap[category] / total) * 100, // Spending percentage
            amount: categoryMap[category],
            cashback: cashbackMap[category] || 0 // Cashback per category
        }));

        console.log("Category Breakdown Data:", breakdown);
        setCategoryBreakdown(breakdown);
    };

    return (
        <div className="container">
            <h1>Spending Breakdown</h1>
            <div className="chart-controls">
                <button onClick={() => setShowSpendingChart(!showSpendingChart)}>
                    {showSpendingChart ? "Hide Spending Chart" : "Show Spending Chart"}
                </button><br></br>
                <button onClick={() => setShowCashbackChart(!showCashbackChart)}>
                    {showCashbackChart ? "Hide Cashback Chart" : "Show Cashback Chart"}
                </button>
            </div>
            <h2>Total Spending: ${totalSpent.toFixed(2)}</h2>



            {/* Spending Graph */}
            {showSpendingChart && categoryBreakdown.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={categoryBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            label={({ name, value }) => `${name} (${value.toFixed(2)}%)`}
                        >
                            {categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    </PieChart>
                </ResponsiveContainer>
            )}

            {/* Cash Back Graph */}
            <h2>Cash Back Breakdown</h2>
            {showCashbackChart && categoryBreakdown.length > 0 && (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={categoryBreakdown}
                            dataKey="cashback" // Using cashback data
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            label={({ name, cashback }) => `${name}: $${cashback.toFixed(2)}`}
                        >
                            {categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                </ResponsiveContainer>
            )}

            <h3>Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount ($)</th>
                        <th>Cash Back ($)</th>
                        <th>Percentage Usage (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryBreakdown.map((data, index) => (
                        <tr key={index}>
                            <td>{data.name}</td>
                            <td>${data.amount.toFixed(2)}</td>
                            <td>${data.cashback.toFixed(2)}</td>
                            <td>{data.value.toFixed(2)}%</td>
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

export default SpendingChart;
