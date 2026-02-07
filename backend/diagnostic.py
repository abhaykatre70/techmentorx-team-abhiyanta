
import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
import dns.resolver

# Load env
load_dotenv()
uri = os.getenv('MONGODB_URI')
print(f"URI from env: {uri}")

try:
    print("Testing connection with pymongo...")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Pymongo Connection Successful!")
except Exception as e:
    print(f"❌ Pymongo Connection Failed: {e}")

try:
    print("Testing DNS resolution for cluster0.eiem5s5.mongodb.net...")
    answers = dns.resolver.resolve('_mongodb._tcp.cluster0.eiem5s5.mongodb.net', 'SRV')
    for rdata in answers:
        print(f"SRV Record: {rdata.target} port {rdata.port}")
except Exception as e:
    print(f"❌ DNS Resolution Failed: {e}")
