from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField
from datetime import datetime
from app.models.user import User
from app.models.donation import Donation

class VolunteerRequest(Document):
    donation = ReferenceField(Donation, required=True)
    volunteer = ReferenceField(User, required=True)
    donor = ReferenceField(User, required=True)
    status = StringField(default='pending', choices=['pending', 'accepted', 'rejected', 'collected', 'distributed', 'completed', 'cancelled'])
    message = StringField()
    collectionDate = DateTimeField()
    beneficiaryCount = IntField(default=0)
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'volunteer_requests',
        'indexes': [
            'donation',
            'volunteer',
            'donor',
            'status'
        ]
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "donationId": str(self.donation.id),
            "volunteerId": str(self.volunteer.id),
            "status": self.status,
            "message": self.message,
            "createdAt": self.createdAt.isoformat()
        }
