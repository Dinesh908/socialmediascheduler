# 🚀 Netlify Quick Start Guide

## Deploy in 5 Steps

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2️⃣ Deploy to Netlify
1. Go to https://www.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Settings are auto-detected from `netlify.toml` ✅
5. Click **"Deploy site"**

### 3️⃣ Deploy Backend (Required)
**Option A: Render (Recommended)**
1. Go to https://render.com
2. New → Web Service → Connect GitHub
3. Settings:
   - Build: `npm install`
   - Start: `npm start`
   - Environment: `NODE_ENV=production`
4. Deploy

**Option B: Railway**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add `NODE_ENV=production`
4. Deploy

### 4️⃣ Connect Frontend to Backend
1. Copy your backend URL (e.g., `https://your-app.onrender.com`)
2. In Netlify → Site settings → Environment variables
3. Add: `REACT_APP_API_URL` = `https://your-app.onrender.com/api`
4. Trigger new deploy

### 5️⃣ Done! 🎉
Your app is live at `https://your-site.netlify.app`

---

## Auto-Deploy Setup ✅

Already configured! Every push to `main` branch automatically deploys.

```bash
git push origin main  # Auto-deploys to Netlify
```

---

## Need More Details?
See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete guide.

