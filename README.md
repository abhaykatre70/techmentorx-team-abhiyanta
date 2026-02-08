# 🎉 HELPING HAND - Community Impact Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=render)](https://techmentorx-team-abhiyanta.onrender.com/)

🚀 **Live Deployment:** [https://techmentorx-team-abhiyanta.onrender.com/](https://techmentorx-team-abhiyanta.onrender.com/)

---

## 🏆 HACKATHON SUCCESS: TECHMENTORX @ PCE NAGPUR
Developed by **Team Abhiyanta** for the **TECHMENTORX Hackathon** organized by the Department of Information Technology, Priyadarshini College of Engineering, Nagpur.

- 🏅 **Shortlisted in Top 30** (among 70+ competing teams)
- 🌟 **Judges' Choice** - Appreciated for its strong concept and real-world social impact.
- 🚀 **Vision** - Bridging the gap between resources and those in need using technology.

### **Meet Team Abhiyanta:**
- **Aaliyah Ali**
- **Vinay Ninave**
- **Abhay Katre**
- **Ashwini Malvi**
- **Piyush Lomte**

---

## 🛠 TECH STACK
Our platform is built using modern, scalable technologies to ensure high performance and reliability:

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Material UI (MUI)
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL) with Real-time triggers
- **Map Engine**: React Simple Maps / Leaflet for Geotagged Visualization
- **Authentication**: JWT & Supabase Auth
- **Deployment**: Render (Static + Web Services)

---

## 🚀 CORE FEATURES

### 🗺️ Interactive India Map
- Real-time visualization of help requests across 16+ states.
- Color-coded urgency levels (Critical, High, Active).
- State-wise analytics for donations, users, and reports.

### 📍 Precise Geotagging System
- Automated GPS coordinate capture.
- Reverse geocoding to identify City, State, and exact Address.
- Timestamped reports with photographic proof upload.

### 👨‍💼 Professional Admin Dashboard
- Centralized management for Users, Tasks, Reports, and Donations.
- Full CRUD operations with secure authentication.
- Real-time notification system for system alerts.

### 🔔 Real-time Notifications
- Instant alerts for volunteers when tasks are assigned nearby.
- Donation matching alerts for NGOs and Donors.
- Unread count badges and interactive notification history.

---

## 💻 HOW TO RUN LOCALLY

### Prerequisites
- Node.js (v20 or higher)
- NPM (v10 or higher)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abhaykatre70/techmentorx-team-abhiyanta.git
   cd techmentorx-team-abhiyanta
   ```

2. **Database Setup**
   - Go to [Supabase](https://supabase.com) and create a new project.
   - Open the **SQL Editor** in Supabase.
   - Run the content of `FINAL_DB_SETUP.sql` to initialize tables and triggers.

3. **Environment Configuration**
   - Create a `.env` file in the `frontend` folder:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Install and Start**
   - Install all dependencies at once using our workspace script:
     ```bash
     npm run install-all
     ```
   - Start the development server:
     ```bash
     npm run start
     ```

---

## � DESIGN SYSTEM & UX
- **Theme**: Vibrant Orange-to-Red gradients representing compassion and urgency.
- **Micro-interactions**: Smooth transitions using Framer Motion for a premium feel.
- **Responsiveness**: Mobile-first design ensures accessibility for on-ground volunteers.
- **Typography**: Poppins (Clean, Modern, and Professional).

---

## 📞 CONTACT & SUPPORT
For feedback, collaborations, or inquiries regarding the "Helping Hand" platform, feel free to reach out to the members of **Team Abhiyanta**.

**Empowering Communities Through Technology.** ✨
