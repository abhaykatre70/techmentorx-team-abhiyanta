from dotenv import load_dotenv
import os
from mongoengine import connect, disconnect_all
from pymongo import MongoClient
import dns # Verify dnspython is available

# Load .env as early as possible
load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None
    
    def connect(self):
        # Ensure we don't have multiple connections
        disconnect_all()
        
        mongo_uri = os.getenv('MONGODB_URI')
        db_name = os.getenv('DB_NAME', 'social_mentor')
        
        if not mongo_uri:
            print("❌ ERROR: MONGODB_URI not found in environment!")
            return
        
        print(f"DEBUG: Initializing connection to {db_name}...")

        try:
            # Connect using mongoengine - use positional argument for db
            connect(db_name, host=mongo_uri, serverSelectionTimeoutMS=10000)
            
            # Connect using pymongo for raw access/verification
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
            self.db = self.client[db_name]
            
            # Verify connection by pinging
            self.client.admin.command('ping')
            print(f"✅ MongoDB Atlas connection verified for {db_name}")
            
            # Test a query immediately
            from mongoengine.connection import get_db
            print(f"DEBUG: MongoEngine default host: {get_db().client.address}")
            
        except Exception as e:
            print(f"❌ MongoDB Connection Failed: {str(e)}")
            if "10061" in str(e) or "Timeout" in str(e):
                print("\n" + "="*50)
                print("🚨 NETWORK/SECURITY ALERT 🚨")
                print("Your computer cannot reach MongoDB Atlas (Port 27017).")
                print("Common Fix: Add your IP to the Atlas 'Network Access' Whitelist.")
                print("Your IP appears to be: 115.247.141.22")
                print("="*50 + "\n")
            raise e
        
    def close(self):
        if self.client:
            self.client.close()

db = Database()
