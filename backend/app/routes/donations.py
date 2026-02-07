from flask import Blueprint, request, jsonify
from app.models.donation import Donation
from app.utils.helpers import token_required
from datetime import datetime

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/', methods=['POST'])
@token_required
def create_donation(current_user):
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('category'):
        return jsonify({"message": "Title and category are required"}), 400
        
    new_donation = Donation(
        donor=current_user,
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        quantity=data.get('quantity', 1),
        unit=data.get('unit'),
        address=data.get('address'),
        location=data.get('location'), # [long, lat]
        priority=data.get('priority', 'medium')
    )
    new_donation.save()
    
    return jsonify({"message": "Donation created successfully", "donation": new_donation.to_json()}), 201

@donations_bp.route('/', methods=['GET'])
def get_donations():
    category = request.args.get('category')
    status = request.args.get('status', 'available')
    
    query = {"status": status}
    if category:
        query["category"] = category
        
    donations = Donation.objects(**query).order_by('-createdAt')
    return jsonify({"donations": [d.to_json() for d in donations]}), 200

@donations_bp.route('/nearby', methods=['GET'])
def get_nearby_donations():
    longitude = float(request.args.get('lon'))
    latitude = float(request.args.get('lat'))
    radius = float(request.args.get('radius', 10)) # in km
    
    # MongoDB 2dsphere proximity search
    donations = Donation.objects(
        location__near=[longitude, latitude],
        location__max_distance=radius * 1000, # to meters
        status='available'
    )
    
    return jsonify({"donations": [d.to_json() for d in donations]}), 200

@donations_bp.route('/<id>', methods=['GET'])
def get_donation(id):
    donation = Donation.objects(id=id).first()
    if not donation:
        return jsonify({"message": "Donation not found"}), 404
    return jsonify(donation.to_json()), 200
