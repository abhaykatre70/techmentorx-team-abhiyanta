# Implementation Plan - Social Mentor (Helping Hand)

This document outlines the roadmap for building the **Social Mentor** platform, a location-based donation and volunteer management system.

## 🛠 Technology Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (OTP/Phone)
- **Maps:** Google Maps API
- **Storage:** Firebase Storage
- **Notifications:** Firebase Cloud Messaging (FCM)

---

## 📅 Phase 1: Project Foundation & Environment Setup
- [ ] **1.1 Backend Setup (Node/Express)**
  - Initialize Node.js project.
  - Install dependencies: `express`, `cors`, `dotenv`, `firebase-admin`.
  - Setup basic server structure.
- [ ] **1.2 Frontend Setup (React/Tailwind)**
  - Configure Tailwind CSS in existing Vite app.
  - Setup specific color palette (Green Impact theme).
  - Install dependencies: `firebase`, `react-router-dom`, `@react-google-maps/api`, `framer-motion`, `react-hot-toast`, `lucide-react`.
- [ ] **1.3 Firebase Integration**
  - Setup Firebase project (Console).
  - Configure `firebase.js` in frontend and backend.
  - Initialize Firestore and Storage buckets.

## 🔐 Phase 2: Authentication & User Roles
- [ ] **2.1 Role-Based Auth Flow**
  - Implement Login/Signup with Phone OTP (or Email fallback for dev).
  - Role selection screen: **Donor**, **Volunteer**, **NGO**.
  - Store user profiles in Firestore `users` collection.
- [ ] **2.2 Protected Routes**
  - Create Role-based Route Guards.
  - Dashboard redirection based on role.

## 📦 Phase 3: Core Features (MVP)
- [ ] **3.1 Maps & Location**
  - Integrate Google Maps.
  - Implement Geolocation API to get user position.
  - Display pins for NGOs, Tasks, and Pickup points.
- [ ] **3.2 Donation Module (Donor)**
  - "Post Donation" form (Food, Clothes, Books).
  - Upload photos (Firebase Storage).
  - Choose delivery method: Self-drop vs. Volunteer Pickup.
- [ ] **3.3 Volunteer Tasks**
  - View nearby pickup/delivery requests.
  - Accept task -> Update status -> Complete task.
  - Geo-tagging verification (End-to-end tracking).
- [ ] **3.4 NGO Dashboard**
  - View incoming donations.
  - Manage inventory/needs.
  - Verify volunteers.

## 📸 Phase 4: Advanced Features
- [ ] **4.1 Geo-tagged Reporting**
  - Camera integration for "Needy Reports".
  - Auto-attach GPS coordinates.
- [ ] **4.2 Food Waste Network**
  - Urgent alerts for surplus food.
  - Fast-track notification system.
- [ ] **4.3 Impact & Gamification**
  - Points system logic.
  - Leaderboard implementation.
  - Certificate generation.

## 🚀 Immediate Next Steps
1.  Re-initialize `backend` with Node.js.
2.  Install Tailwind CSS in `frontend`.
3.  Setup Firebase Configuration files.
4.  Scaffold the folder structure for the new stack.
