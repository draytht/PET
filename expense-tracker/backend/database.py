import couchdb
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()
# CouchDB connection details
COUCHDB_URL = os.getenv("COUCHDB_URL") 
DATABASE_NAME = os.getenv("TRANSACTION_DB_NAME")

def connect_to_couchdb():
    """Connect to CouchDB and return the database object."""
    try:
        couch = couchdb.Server(COUCHDB_URL)  
        couch.resource.credentials = ('admin', '123456') 

        if DATABASE_NAME in couch:
            db = couch[DATABASE_NAME]  
            print(f"Connected to existing database: {DATABASE_NAME}")
        else:
            print(f"Database '{DATABASE_NAME}' not found. Please create it manually in CouchDB.")
            return None
        return db
    except Exception as e:
        print(f"Error connecting to CouchDB: {e}")
        return None

def insert_transactions_to_couchdb(db, df):
    """Insert transaction data into CouchDB."""
    try:
        for _, row in df.iterrows():
            doc = {
                "transaction_id": row["transaction_id"],
                "user_id": row["user_id"],
                "transaction_date": row["transaction_date"],
                "product_category": row["product_category"],
                "product_name": row["product_name"],
                "merchant_name": row["merchant_name"],
                "product_amount": row["product_amount"],
                "transaction_fee": row["transaction_fee"],
                "cashback": row["cashback"],
                "loyalty_points": row["loyalty_points"],
                "payment_method": row["payment_method"],
                "transaction_status": row["transaction_status"],
                "merchant_id": row["merchant_id"],
                "device_type": row["device_type"],
                "location": row["location"],
            }
            db.save(doc)  # Save document to CouchDB
        print("Transactions inserted successfully into CouchDB!")
    except Exception as e:
        print(f"Error inserting transactions: {e}")

def main():
    # file_path = r"C:\Users\Thanh\OneDrive\Desktop\MyProj\team2proj\expense-tracker\digital_wallet_transactions.csv"
    file_path = r"/Users/thadat/PET/expense-tracker/digital_wallet_transactions.csv"

    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        return
    
    db = connect_to_couchdb()
    if db and not df.empty:
        insert_transactions_to_couchdb(db, df)

if __name__ == "__main__":
    main()
