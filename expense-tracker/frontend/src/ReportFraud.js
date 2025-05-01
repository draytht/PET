import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ReportFraud() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/transactions").then((res) => {
      const tx = res.data.find((t) => t._id === id);
      if (tx) setTransaction(tx);
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!reason || !description) {
      alert("Please complete all fields.");
      return;
    }

    await axios.post("http://127.0.0.1:5000/report-fraud", {
      transaction_id: id,
      reason,
      description,
    });

    alert("Fraud report submitted!");
    navigate("/fraud-reports");
  };

  if (!transaction) return <p>Loading transaction...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Report Fraud</h2>
      <p><b>Transaction ID:</b> {transaction.transaction_id}</p>
      <p><b>Category:</b> {transaction.product_category}</p>
      <p><b>Amount:</b> ${transaction.product_amount.toFixed(2)}</p>

      <label>Reason:</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="">Select</option>
        <option>Unauthorized Transaction</option>
        <option>Scam</option>
        <option>Overcharge</option>
        <option>Other</option>
      </select><br />

      <label>Description:</label><br />
      <textarea
        rows="5"
        cols="40"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What happened?"
      ></textarea><br />

      <button onClick={handleSubmit}>Submit Report</button>
    </div>
  );
}

export default ReportFraud;
