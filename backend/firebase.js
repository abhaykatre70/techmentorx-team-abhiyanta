const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
// Ideally, use a service account key file for production
// For now, we'll use a placeholder or assume default credentials if running in Google Cloud
// Steps to get service account: Project Settings -> Service Accounts -> Generate Private Key

// UNCOMMENT THE BELOW LINES AND ADD YOUR SERVICE ACCOUNT PATH
// const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "YOUR_PROJECT_ID.appspot.com"
// });

// Placeholder initialization (will warn but compile)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } catch (error) {
        console.log('Firebase Admin Initialization Skipping... waiting for credentials');
    }
}

const db = admin.firestore(); // Corrected initialization
module.exports = { admin, db };
