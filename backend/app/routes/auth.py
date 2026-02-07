from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.helpers import hash_password, check_password, generate_token, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400
        
    if User.objects(email=data.get('email')).first():
        return jsonify({"message": "User already exists"}), 400
        
    hashed_pw = hash_password(data.get('password'))
    
    new_user = User(
        email=data.get('email'),
        password=hashed_pw,
        fullName=data.get('fullName'),
        role=data.get('role', 'donor')
    )
    new_user.save()
    
    return jsonify({"message": "User registered successfully", "user": new_user.to_json()}), 201

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
