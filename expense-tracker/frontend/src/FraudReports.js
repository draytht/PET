import React, { useEffect, useState } from "react";
import axios from "axios";

function FraudReports() {
  const [frauds, setFrauds] = useState([]);

  // useEffect(() => {
  //   axios.get("http://127.0.0.1:5000/fraud-reports").then((res) => {
  //     setFrauds(res.data);
  //   });
  // }, []);
    useEffect(() => {
    axios.get("https://pet-7r7h.onrender.com/fraud-reports").then((res) => {
      setFrauds(res.data);
    });
    }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fraud Reports</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Reason</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {frauds.map((f) => (
            <tr key={f._id}>
              <td>{f.transaction_id}</td>
              <td>{f.product_category}</td>
              <td>${f.product_amount.toFixed(2)}</td>
              <td>{f.fraud_reason}</td>
              <td>{f.fraud_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraudReports;
