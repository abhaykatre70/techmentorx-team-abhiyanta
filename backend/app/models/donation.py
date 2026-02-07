from mongoengine import Document, StringField, IntField, DateTimeField, ListField, PointField, ReferenceField
from datetime import datetime
from app.models.user import User

class Donation(Document):
    donor = ReferenceField(User, required=True)
    title = StringField(required=True)
    description = StringField()
    category = StringField(required=True, choices=['food', 'clothes', 'toys', 'essentials', 'books', 'medical'])
    quantity = IntField(default=1)
    unit = StringField()
    expiryDate = DateTimeField()
    images = ListField(StringField())  # Array of URLs
    location = PointField()  # [longitude, latitude]
    address = StringField()
    status = StringField(default='available', choices=['available', 'requested', 'collected', 'distributed', 'completed', 'cancelled'])
    priority = StringField(default='medium', choices=['low', 'medium', 'high', 'urgent'])
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'donations',
        'indexes': [
            'donor',
            'status',
            'category',
            {'fields': ['location'], 'cls': '2dsphere'}
        ]
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "donor": str(self.donor.id),
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "quantity": self.quantity,
            "unit": self.unit,
            "status": self.status,
            "priority": self.priority,
            "location": self.location,
            "address": self.address,
            "createdAt": self.createdAt.isoformat()
        }
