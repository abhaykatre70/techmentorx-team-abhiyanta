# Social Mentor (Helping Hand) - MVP

## 🚀 Getting Started

This project is a React (Frontend) + Node/Express (Backend) + Firebase (DB/Auth) application.

### Prerequisites
- Node.js (v18+)
- Firebase Account (for real Auth/DB)
- Google Maps API Key (for Maps)

### 1. Backend Setup
The backend runs on port 5000.

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
The frontend runs on port 5173.

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables
You need to update the configuration files with your own keys:
- **Frontend:** Update `frontend/.env` with your Google Maps API Key.
- **Frontend:** Update `frontend/src/firebase.js` with your Firebase Web Config.
- **Backend:** Update `backend/firebase.js` with your Service Account credentials (if using Admin SDK).

### 📍 Features Implemented
- **Landing Page:** Modern UI with "Green Impact" theme.
- **Login:** Phone OTP flow (Mock) + Role Selection (Donor, Volunteer, NGO).
- **Dashboard:** 
  - Impact Stats.
  - Live Map Integration (Google Maps).
  - "Report Needy" Camera Action (Mobile-ready).
  - Nearby Needs List.

### 📱 Tech Stack
- Frontend: React + Tailwind CSS + Lucide Icons
- Backend: Express + Firebase Admin
- Database: Firestore (Configured)
