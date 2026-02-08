# 🚀 Deploy Tech Mentor X to Render

This guide will help you deploy your Tech Mentor X application to Render.

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ A [Render account](https://render.com) (free tier available)
2. ✅ Your Supabase project is set up and running
3. ✅ Your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

## 🎯 Deployment Steps

### Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

### Step 2: Create a New Static Site on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click **"New +"** button
   - Select **"Static Site"**

2. **Connect Your Repository**
   - Click **"Connect account"** to link GitHub/GitLab/Bitbucket
   - Select your repository: `techmentorx-team-abhiyanta`
   - Click **"Connect"**

3. **Configure Build Settings**
   - **Name:** `techmentorx-frontend` (or any name you prefer)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables** (Optional)
   - If you have any environment variables in `.env`, add them here
   - Click **"Add Environment Variable"**
   - For now, you can skip this as Supabase config is in the code

5. **Click "Create Static Site"**
   - Render will start building your app
   - This takes about 2-5 minutes

---

### Step 3: Wait for Deployment

- Render will:
  1. Clone your repository
  2. Install dependencies (`npm install`)
  3. Build your React app (`npm run build`)
  4. Deploy the static files

- You'll see build logs in real-time
- Once complete, you'll get a URL like: `https://techmentorx-frontend.onrender.com`

---

### Step 4: Test Your Deployed App

1. **Open the Render URL** (e.g., `https://techmentorx-frontend.onrender.com`)
2. **Test Login** with demo credentials:
   - Email: `admin@ngo.org`
   - Password: `123456`
3. **Verify Features:**
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Tasks/Donations/Reports display
   - ✅ Camera and GPS work (requires HTTPS - Render provides this automatically)

---

## 🔧 Configuration Files Created

I've created the following files for your deployment:

### 1. `frontend/render.yaml`
- Render configuration file
- Defines build and publish settings
- Specifies Node.js version

### 2. `frontend/public/_redirects`
- Handles client-side routing
- Ensures React Router works correctly
- Redirects all routes to `index.html`

---

## 🌐 Custom Domain (Optional)

To use your own domain:

1. Go to your Render dashboard
2. Click on your static site
3. Go to **"Settings"** → **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter your domain (e.g., `techmentorx.com`)
6. Follow DNS configuration instructions
7. Render provides free SSL certificates automatically!

---

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to your repository:

```bash
# Make changes to your code
git add .
git commit -m "Updated feature"
git push

# Render will automatically detect the push and redeploy!
```

---

## 🐛 Troubleshooting

### Problem: Build Fails

**Check:**
1. **Build logs** in Render dashboard
2. Make sure `package.json` is in the `frontend` folder
3. Verify Node.js version compatibility

**Solution:**
- Set Node.js version in Render:
  - Go to **Environment** tab
  - Add variable: `NODE_VERSION` = `18.17.0`

---

### Problem: Blank Page After Deployment

**Check:**
1. Browser console (F12) for errors
2. Supabase URL and API key are correct in `frontend/src/supabase.js`

**Solution:**
- Verify Supabase credentials
- Check if `_redirects` file is in `public` folder
- Rebuild the site

---

### Problem: Routes Don't Work (404 Error)

**Solution:**
- Make sure `frontend/public/_redirects` file exists
- Content should be: `/* /index.html 200`
- Redeploy the site

---

### Problem: Camera/GPS Not Working

**Reason:**
- Camera and GPS require HTTPS (secure connection)

**Solution:**
- ✅ Render provides HTTPS automatically
- Make sure you're accessing via `https://` not `http://`
- Allow camera/location permissions when browser prompts

---

## 📊 Monitoring Your Deployment

### View Logs
1. Go to Render dashboard
2. Click on your static site
3. Click **"Logs"** tab
4. See real-time deployment and access logs

### View Metrics
1. Click **"Metrics"** tab
2. See bandwidth usage, requests, etc.

---

## 💰 Pricing

**Render Free Tier Includes:**
- ✅ Static sites (unlimited)
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ 100 GB bandwidth/month
- ✅ Auto-deploy from Git

**Perfect for this project!** 🎉

---

## 🎉 You're Done!

Your Tech Mentor X app is now live on the internet!

**Share your URL:**
- `https://techmentorx-frontend.onrender.com` (or your custom domain)

**Next Steps:**
1. Share the link with your team
2. Test all features
3. Monitor usage in Render dashboard
4. Set up custom domain (optional)

---

## 📞 Need Help?

If you encounter issues:
1. Check Render build logs
2. Verify Supabase connection
3. Test locally first (`npm run build` → `npm run preview`)
4. Check browser console for errors

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs/static-sites
- **Supabase Dashboard:** https://supabase.com/dashboard

---

**Happy Deploying! 🚀**
