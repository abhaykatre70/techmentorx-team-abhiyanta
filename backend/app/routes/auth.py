from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.helpers import hash_password, check_password, generate_token, token_required
from mongoengine.connection import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Diagnostic: What is the current connection?
        try:
            conn_info = get_db().client.address
            print(f"DEBUG: Registration using DB at: {conn_info}")
        except Exception as conn_err:
            print(f"DEBUG: Failed to get connection info: {conn_err}")

        data = request.get_json()
        print(f"DEBUG: Received registration request for: {data.get('email')}")
        
        if not data or not data.get('email') or not data.get('password'):
            print("DEBUG: Missing email or password")
            return jsonify({"message": "Email and password are required"}), 400
            
        if User.objects(email=data.get('email')).first():
            print(f"DEBUG: User already exists: {data.get('email')}")
            return jsonify({"message": "User already exists"}), 400
            
        hashed_pw = hash_password(data.get('password'))
        
        new_user = User(
            email=data.get('email'),
            password=hashed_pw,
            fullName=data.get('fullName'),
            role=data.get('role', 'donor')
        )
        print("DEBUG: Attempting to save user to MongoDB...")
        new_user.save()
        print("DEBUG: User saved successfully")
        
        return jsonify({"message": "User registered successfully", "user": new_user.to_json()}), 201
    except Exception as e:
        print(f"DEBUG: Critical Error during registration: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server Error: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
        
    user = User.objects(email=data.get('email')).first()
    
    if not user or not check_password(data.get('password'), user.password):
        return jsonify({"message": "Invalid email or password"}), 401
        
    token = generate_token(user.id)
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_json()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_json()), 200
