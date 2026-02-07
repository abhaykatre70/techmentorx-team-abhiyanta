from mongoengine import Document, StringField, IntField, BooleanField, DateTimeField, PointField, EmbeddedDocument, EmbeddedDocumentField
from datetime import datetime

class UserAddress(EmbeddedDocument):
    street = StringField()
    city = StringField()
    state = StringField()
    zipCode = StringField()
    country = StringField()

class User(Document):
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    fullName = StringField()
    phone = StringField()
    role = StringField(choices=['donor', 'volunteer', 'beneficiary', 'admin'], default='donor')
    location = PointField()  # [longitude, latitude]
    address = EmbeddedDocumentField(UserAddress)
    points = IntField(default=0)
    verified = BooleanField(default=False)
    profileImage = StringField()
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'users',
        'indexes': [
            'email',
            {'fields': ['location'], 'cls': '2dsphere'}
        ]
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "fullName": self.fullName,
            "role": self.role,
            "points": self.points,
            "verified": self.verified
        }
