# 🚀 Quick Start Guide - Tech Mentor X

## ⚡ 5-Minute Setup

### Step 1: Configure Supabase
1. Go to your Supabase project dashboard
2. Run the SQL script: `SUPABASE_FINAL_RESET.sql`
   - Go to SQL Editor in Supabase
   - Copy entire contents of `SUPABASE_FINAL_RESET.sql`
   - Paste and click "Run"
   - ✅ This creates all tables + demo data

### Step 2: Configure Frontend Environment
1. Open `frontend/.env` (create if missing)
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Install & Run
```bash
# Install dependencies (one time)
cd frontend
npm install

# Run the app
npm run dev
```

### Step 4: Login
Open `http://localhost:5173` and use:

**Admin Account:**
- Email: `admin@ngo.org`
- Password: `123456` (or any password - demo mode)

**Volunteer Account:**
- Email: `rahul@volunteer.com`  
- Password: `123456`

**Donor Account:**
- Email: `priya@donor.com`
- Password: `123456`

---

## 🐛 Troubleshooting

### "No tasks/donations showing"
**Cause:** Supabase not configured or SQL not run

**Fix:**
1. Check `frontend/.env` has correct Supabase URL and key
2. Run `SUPABASE_FINAL_RESET.sql` in Supabase SQL Editor
3. Refresh the page

### "Failed to show" error
**Cause:** RLS policies blocking access

**Fix:**
The SQL script already has open policies for demo. If still failing:
1. Go to Supabase → Authentication → Policies
2. Ensure all tables have "Public Read" policies enabled

### "Logout on refresh"
**Fix:** This is now fixed with localStorage persistence. Clear browser cache if issue persists.

---

## ✨ Features Working

✅ **Login/Signup** - Works with any password for demo users  
✅ **Session Persistence** - Stays logged in after refresh  
✅ **Role-Based Dashboards** - Different views for Admin/Volunteer/Donor  
✅ **Geo-Tagging Reports** - Camera + GPS integration  
✅ **Gamification** - Earn points for completing tasks (+100) and reports (+50)  
✅ **Location Sorting** - Tasks/Reports sorted by distance  

---

## 📊 Demo Data Included

- **5 Users** (Admin, 2 Volunteers, 2 Donors)
- **4 Donations** (Food, Books, Clothes, Blankets)
- **3 Reports** (Needy families/individuals)
- **5 Tasks** (Pickups, Deliveries, Volunteering)
- **2 Messages** (Contact form submissions)

All with Indian context (Delhi, Noida, Gurgaon locations)
