from flask import Flask
from flask_cors import CORS
from app.database import db
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()
    
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Initialize Database
    db.connect()
    
    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.donations import donations_bp
    from app.routes.volunteers import volunteers_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(donations_bp, url_prefix='/api/donations')
    app.register_blueprint(volunteers_bp, url_prefix='/api/volunteers')
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200
        
    return app
