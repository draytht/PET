from flask import Flask, jsonify, request
from flask_cors import CORS
import couchdb
import uuid
import bcrypt
import openai
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
# Load API key (store it securely!)
openai.api_key = os.getenv("OPENAI_API_KEY")
# CouchDB Configuration
COUCHDB_URL = os.getenv("COUCHDB_URL")
TRANSACTION_DB_NAME = os.getenv("TRANSACTION_DB_NAME")
USER_DB_NAME = os.getenv("USER_DB_NAME") # Database for authentication

def connect_to_couchdb(db_name):
    """Connects to CouchDB and returns the database object."""
    couch = couchdb.Server(COUCHDB_URL)
    if db_name not in couch:
        couch.create(db_name)
    return couch[db_name]

# ✅ TRANSACTIONS API
@app.route('/transactions', methods=['GET'])
def get_transactions():
    """Fetches all transactions from CouchDB."""
    db = connect_to_couchdb(TRANSACTION_DB_NAME)
    transactions = [{"_id": doc, **db[doc]} for doc in db]
    return jsonify(transactions)

@app.route('/transactions', methods=['POST'])
def add_transaction():
    """Adds a new transaction to CouchDB."""
    db = connect_to_couchdb(TRANSACTION_DB_NAME)
    data = request.json
    transaction_id = str(uuid.uuid4())

    doc = {
        "_id": transaction_id,
        "transaction_id": transaction_id,
        "user_id": data["user_id"],
        "transaction_date": data["transaction_date"],
        "product_category": data["product_category"],
        "product_name": data["product_name"],
        "merchant_name": data["merchant_name"],
        "product_amount": data["product_amount"],
        "transaction_fee": data.get("transaction_fee", 0),
        "cashback": data.get("cashback", 0),
        "loyalty_points": data.get("loyalty_points", 0),
        "payment_method": data["payment_method"],
        "transaction_status": data["transaction_status"],
        "merchant_id": data["merchant_id"],
        "device_type": data["device_type"],
        "location": data["location"],
    }
    db.save(doc)
    return jsonify({"message": "Transaction added successfully!"}), 201

@app.route('/transactions/<string:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Deletes a transaction from CouchDB."""
    db = connect_to_couchdb(TRANSACTION_DB_NAME)
    try:
        db.delete(db[transaction_id])
        return jsonify({"message": "Transaction deleted successfully!"}), 200
    except couchdb.http.ResourceNotFound:
        return jsonify({"error": "Transaction not found!"}), 404

# ✅ USER AUTHENTICATION API
@app.route('/signup', methods=['POST'])
def signup():
    """Handles user registration and stores user info in the 'users' database."""
    db = connect_to_couchdb(USER_DB_NAME)
    data = request.json
    email = data.get("email")

    if email in db:
        return jsonify({"message": "Email already registered!", "success": False}), 400

    hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())

    user_doc = {
        "_id": email,  # Using email as a unique identifier
        "name": data["name"],
        "email": email,
        "password": hashed_password.decode("utf-8")
    }
    
    db.save(user_doc)
    return jsonify({"message": "Signup successful!", "success": True}), 201

# @app.route('/login', methods=['POST'])
# def login():
#     """Handles user authentication using the 'users' database."""
#     db = connect_to_couchdb(USER_DB_NAME)
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if email not in db:
#         return jsonify({"message": "User not found", "success": False}), 401

#     user = db[email]
    
#     if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
#         return jsonify({"message": "Login successful!", "success": True, "user": {"name": user["name"], "email": user["email"]}}), 200
    
#     return jsonify({"message": "Invalid password", "success": False}), 401
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # existing login logic
        db = connect_to_couchdb(USER_DB_NAME)
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if email not in db:
            return jsonify({"message": "User not found", "success": False}), 401

        user = db[email]

        if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"message": "Login successful!", "success": True, "user": {"name": user["name"], "email": user["email"]}}), 200

        return jsonify({"message": "Invalid password", "success": False}), 401
    else:
        # GET request fallback response
        return jsonify({"message": "This is the login endpoint. Please POST your credentials here."}), 200

# ✅ GET ALL USERS (FOR DEBUGGING)
@app.route('/users', methods=['GET'])
def get_users():
    """Fetches all registered users from CouchDB (Excluding Passwords)."""
    db = connect_to_couchdb(USER_DB_NAME)
    users = [{"email": db[doc]["email"], "name": db[doc]["name"]} for doc in db]  # Exclude password
    return jsonify(users)

# ✅ DELETE USER
@app.route('/users/<email>', methods=['DELETE'])
def delete_user(email):
    """Deletes a user from the 'users' database."""
    db = connect_to_couchdb(USER_DB_NAME)
    if email in db:
        db.delete(db[email])
        return jsonify({"message": "User deleted successfully!"}), 200
    return jsonify({"message": "User not found"}), 404

@app.route("/report-fraud", methods=["POST"])
def report_fraud():
    db = connect_to_couchdb(TRANSACTION_DB_NAME)
    data = request.json
    tx_id = data.get("transaction_id")

    if tx_id not in db:
        return jsonify({"error": "Transaction not found"}), 404

    tx = db[tx_id]
    tx["is_fraud"] = True
    tx["fraud_reason"] = data.get("reason")
    tx["fraud_description"] = data.get("description")
    db.save(tx)

    return jsonify({"message": "Fraud report saved"}), 200

@app.route("/fraud-reports", methods=["GET"])
def fraud_reports():
    db = connect_to_couchdb(TRANSACTION_DB_NAME)
    reports = [dict(_id=doc, **db[doc]) for doc in db if db[doc].get("is_fraud")]
    return jsonify(reports), 200

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_id = data.get("user_id", "unknown")
        user_input = data.get("message", "")

        if not user_input:
            return jsonify({"error": "Message is required"}), 400

        # ✅ Load all transactions for context
        tx_db = connect_to_couchdb(TRANSACTION_DB_NAME)
        transactions = [dict(tx_id=doc, **tx_db[doc]) for doc in tx_db]

        # ✅ Build AI prompt with data
        system_prompt = f"""
        You are a helpful financial assistant. You can analyze and answer questions based on the user's transaction history.
        Here is the data:
        {transactions[:50]}  # Only send top 50 for performance
        """

        # ✅ Query GPT
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )
        answer = response["choices"][0]["message"]["content"].strip()

        return jsonify({"response": answer})

    except Exception as e:
        print("❌ Chat error:", e)
        return jsonify({"error": "Chat error"}), 500
    
@app.route('/chat-history/<user_id>', methods=['GET'])
def chat_history(user_id):
    db = connect_to_couchdb("chat-history")
    history = [
        {"_id": doc, **db[doc]}
        for doc in db
        if db[doc].get("user_id") == user_id
    ]
    return jsonify(history)

# ✅ RUN FLASK SERVER
if __name__ == '__main__':
    app.run(debug=True)
