from mongoengine import connect
import os
from pymongo import MongoClient

class Database:
    def __init__(self):
        self.client = None
        self.db = None
    
    def connect(self):
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/social_mentor')
        db_name = os.getenv('DB_NAME', 'social_mentor')
        
        # MongoEngine connection for ODM
        connect(
            db=db_name,
            host=mongo_uri
        )
        
        # PyMongo client for raw queries if needed
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        print(f"Connected to MongoDB: {db_name}")
        
    def close(self):
        if self.client:
            self.client.close()

db = Database()
