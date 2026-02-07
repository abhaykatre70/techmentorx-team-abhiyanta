
# Firebase Setup Guide

Follow these steps to configure your Firebase backend for Authentication and Database.

## 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it (e.g., `helping-hand`).
3. Disable Google Analytics for this prototype (optional) and click **"Create project"**.

## 2. Enable Authentication
1. In the sidebar, click **Build** -> **Authentication**.
2. Click **"Get started"**.
3. Under **Sign-in method**, select **Email/Password**.
4. Enable **Email/Password** and click **Save**.
5. (Optional) Enable **Google** sign-in if you want Google Login support.

## 3. Enable Firestore Database
1. In the sidebar, click **Build** -> **Firestore Database**.
2. Click **"Create database"**.
3. Choose a location (e.g., `nam5 (us-central)` or `asia-south1`).
4. Start in **Test mode** (for development) and click **Create**.

## 4. Get Configuration Keys
1. In the Project Overview (gear icon ⚙️), select **Project settings**.
2. Scroll to the **"Your apps"** section.
3. Click the `</>` (Web) icon to register a web app.
4. Name it `frontend` (no need for hosting).
5. Copy the `firebaseConfig` object given. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## 5. Add Keys to Your Project
Open `frontend/src/firebase.js` in your code editor and replace the placeholder values with your actual keys:

```javascript
// frontend/src/firebase.js

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};
```

## 6. Restart Server
After saving `firebase.js`, restart your frontend server:
```bash
Ctrl + C
npm run dev
```

Now your **Login**, **Registration**, and **Contact Form** will store real data in Firebase!
