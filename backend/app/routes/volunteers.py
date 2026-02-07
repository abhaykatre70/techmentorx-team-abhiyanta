from flask import Blueprint, request, jsonify
from app.models.volunteer import VolunteerRequest
from app.models.donation import Donation
from app.utils.helpers import token_required
from datetime import datetime

volunteers_bp = Blueprint('volunteers', __name__)

@volunteers_bp.route('/request', methods=['POST'])
@token_required
def create_request(current_user):
    data = request.get_json()
    donation_id = data.get('donationId')
    
    if not donation_id:
        return jsonify({"message": "Donation ID is required"}), 400
        
    donation = Donation.objects(id=donation_id).first()
    if not donation:
        return jsonify({"message": "Donation not found"}), 404
        
    # Check if a request already exists
    existing = VolunteerRequest.objects(donation=donation, volunteer=current_user).first()
    if existing:
        return jsonify({"message": "You have already requested this donation"}), 400
        
    new_request = VolunteerRequest(
        donation=donation,
        volunteer=current_user,
        donor=donation.donor,
        message=data.get('message'),
        status='pending'
    )
    new_request.save()
    
    return jsonify({"message": "Request sent successfully", "request": new_request.to_json()}), 201

@volunteers_bp.route('/my-requests', methods=['GET'])
@token_required
def get_my_requests(current_user):
    requests = VolunteerRequest.objects(volunteer=current_user).order_by('-createdAt')
    return jsonify({"requests": [r.to_json() for r in requests]}), 200

@volunteers_bp.route('/incoming-requests', methods=['GET'])
@token_required
def get_incoming_requests(current_user):
    requests = VolunteerRequest.objects(donor=current_user).order_by('-createdAt')
    return jsonify({"requests": [r.to_json() for r in requests]}), 200

@volunteers_bp.route('/requests/<id>/status', methods=['PUT'])
@token_required
def update_request_status(current_user, id):
    data = request.get_json()
    new_status = data.get('status')
    
    req = VolunteerRequest.objects(id=id).first()
    if not req:
        return jsonify({"message": "Request not found"}), 404
        
    # Only donor or volunteer can update status depending on what it is
    # For simplicity, let's allow anyone to update for now, but usually it involves RBAC
    req.status = new_status
    req.updatedAt = datetime.utcnow()
    req.save()
    
    # If accepted, update donation status
    if new_status == 'accepted':
        donation = req.donation
        donation.status = 'requested'
        donation.save()
        
    return jsonify({"message": f"Status updated to {new_status}"}), 200
