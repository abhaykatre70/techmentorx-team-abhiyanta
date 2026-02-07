from flask import Blueprint, jsonify

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/', methods=['GET'])
def get_donations():
    return jsonify({"donations": []}), 200
