# Tech Mentor X - Disaster Management Platform

A geo-tagged disaster relief and aid coordination platform with role-based access for NGOs, Volunteers, and Donors.

## 🚀 Quick Setup (5 Minutes)

### 1️⃣ Setup Supabase Database

1. **Go to your Supabase project** at https://supabase.com
2. **Open SQL Editor** (left sidebar)
3. **Copy and run** the entire `SUPABASE_FINAL_RESET.sql` file
4. **Verify** - You should see 5 tables created with demo data

### 2️⃣ Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Test Connection (Optional but Recommended)

Open `http://localhost:5173/test-supabase.html` to verify:
- ✅ Supabase connection works
- ✅ All tables have data
- ✅ No permission errors

### 4️⃣ Login & Test

Open `http://localhost:5173` and login with:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **NGO Admin** | admin@ngo.org | 123456 | View all reports, manage tasks |
| **Volunteer** | rahul@volunteer.com | 123456 | Complete tasks, earn points |
| **Donor** | priya@donor.com | 123456 | See needy reports, donate |

---

## ✨ Features

### 🎯 Core Features
- **Geo-Tagged Reporting** - Camera + GPS integration for verified reports
- **Role-Based Dashboards** - Custom views for each user type
- **Location-Based Sorting** - Tasks/Reports sorted by proximity
- **Gamification** - Earn points for completing tasks and submitting reports
- **Session Persistence** - Stay logged in across page refreshes

### 🏆 Gamification System
- **+50 points** - Submit a geo-tagged report
- **+100 points** - Complete a volunteer task
- **Real-time updates** - Points update immediately in the dashboard

### 📱 User Roles

**NGO Admin**
- View all incoming reports
- Manage volunteer tasks
- Monitor donations
- Access full analytics

**Volunteer**
- View nearby tasks (sorted by distance)
- Complete tasks to earn points
- Track personal impact score
- Accept delivery/pickup missions

**Donor**
- Browse needy reports nearby
- Submit donation pledges
- Track donation status
- View impact of contributions

---

## 🐛 Troubleshooting

### Problem: "No tasks/donations showing" or "Failed to show"

**Solution:**
1. **Check Supabase Config**
   - Open `frontend/src/supabase.js`
   - Verify URL and Key are correct
   
2. **Run SQL Script**
   - Go to Supabase → SQL Editor
   - Run `SUPABASE_FINAL_RESET.sql`
   - This creates tables + demo data

3. **Check Browser Console**
   - Press F12 → Console tab
   - Look for errors with 🔍 emoji
   - Common issues:
     - "relation does not exist" → Run SQL script
     - "permission denied" → Check RLS policies
     - "Failed to fetch" → Check Supabase URL

4. **Use Test Page**
   - Go to `http://localhost:5173/test-supabase.html`
   - Click "Check All Tables"
   - Should show: users(5), tasks(5), donations(4), reports(3), messages(2)

### Problem: Logout on page refresh

**Fixed!** The app now uses localStorage to persist sessions. If still happening:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)

### Problem: Camera not loading

**Solutions:**
- **Allow camera permission** when browser prompts
- **Use HTTPS** (camera requires secure context)
- **Check browser compatibility** (Chrome/Edge recommended)

### Problem: GPS not working

**Solutions:**
- **Allow location permission** when prompted
- **Enable location services** on your device
- App works without GPS but won't show distance sorting

---

## 📊 Demo Data Included

The SQL script includes realistic Indian-context data:

**Users (5)**
- Aditi Rao (NGO Admin)
- Rahul Sharma (Volunteer)
- Priya Verma (Donor)
- Vikram Singh (Volunteer)
- Sneha Gupta (Donor)

**Tasks (5)**
- Food pickup at Haldirams
- Medicine delivery (Insulin)
- Needy report verification
- Weekend math teaching
- Stray dog feeding drive

**Donations (4)**
- Rice bags (10 bags)
- School books (15 sets)
- Winter jackets (5 pieces)
- Woolen blankets (50 pieces)

**Reports (3)**
- Slum children need study materials
- Homeless family needs blankets
- Elderly man needs food ration

All with real Delhi/Noida/Gurgaon GPS coordinates!

---

## 🔧 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Maps:** Geolocation API
- **Camera:** MediaDevices API
- **Icons:** Lucide React
- **Styling:** Tailwind CSS + Custom CSS

---

## 📝 Development Notes

### File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── GeoCamera.jsx      # Camera + GPS integration
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx      # Role-based dashboard
│   │   ├── Login.jsx          # Auth page
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx    # Auth + session management
│   ├── supabase.js            # Supabase client config
│   └── ...
├── test-supabase.html         # Connection test page
└── ...
```

### Key Files to Configure
1. `frontend/src/supabase.js` - Supabase credentials
2. `SUPABASE_FINAL_RESET.sql` - Database schema + data

---

## 🎓 For Developers

### Adding New Features

**Add a new table:**
1. Add CREATE TABLE in `SUPABASE_FINAL_RESET.sql`
2. Add RLS policies
3. Add demo data INSERT statements
4. Run the script in Supabase

**Add a new user role:**
1. Add role to `users` table inserts
2. Update `AuthContext.jsx` fallback users
3. Add role-specific logic in `Dashboard.jsx`

**Add more points rewards:**
1. Import `updatePoints` from `useAuth()`
2. Call `updatePoints(amount)` after action
3. Points auto-save to localStorage + DB

---

## 🚀 Deploy to Render

### Quick Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Static Site on Render**
   - Go to https://dashboard.render.com
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository
   - Configure settings:
     - **Name:** `techmentorx-frontend`
     - **Branch:** `main`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
   - Click **"Create Static Site"**

3. **Wait for Deployment** (2-5 minutes)
   - You'll get a URL like: `https://techmentorx-frontend.onrender.com`

4. **Test Your Live App**
   - Login with demo credentials
   - All features work (Camera/GPS require HTTPS - provided by Render)

### Features Included
- ✅ Free HTTPS & SSL certificate
- ✅ Auto-deploy on Git push
- ✅ Global CDN
- ✅ 100 GB bandwidth/month (free tier)

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Use test page: `/test-supabase.html`
3. Verify SQL script ran successfully
4. Check Supabase project is active

---

## 🎉 You're All Set!

The app should now be fully functional with:
- ✅ Login working (any password for demo users)
- ✅ Dashboard showing tasks/donations/reports
- ✅ Camera + GPS working
- ✅ Points system active
- ✅ Session persistence working

**Enjoy building! 🚀**
