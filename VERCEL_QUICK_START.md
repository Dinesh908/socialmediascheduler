# Quick Vercel Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project root directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → social-media-scheduler (or your choice)
- **Directory?** → ./
- **Override settings?** → No

### Step 4: Deploy to Production

```bash
vercel --prod
```

---

## 📋 Alternative: Deploy via GitHub

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"
5. Vercel will auto-detect settings:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install`
6. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
```
NODE_ENV=production
```

---

## 🧪 Local Testing

### Option 1: Create a `.env` File (Recommended)

In your project's root folder, create a file called `.env`:

```env
NODE_ENV=production
```

Your app (and most frameworks) will read this value when it starts.

### Option 2: Set via Command Line (Temporary)

You can temporarily set `NODE_ENV` from your terminal before running the app.

**On Windows (Command Prompt):**
```cmd
set NODE_ENV=production
```

**On Linux or macOS (Terminal):**
```bash
export NODE_ENV=production
```

After setting it, run your app in the same terminal session:
```bash
npm start
```

---

## ⚠️ Important: Database Limitation

**SQLite on Vercel has limitations:**
- Serverless functions are stateless
- SQLite database file won't persist between requests
- Data will reset on each deployment

### Solutions:

**Option A: Use External Database**
- Deploy backend to Railway/Render with SQLite
- Or use PostgreSQL/MongoDB

**Option B: Use Vercel KV** (for simple data)
- Vercel's key-value store
- Good for small datasets

**Option C: Keep Frontend on Vercel, Backend Elsewhere**
- Frontend: Vercel (React app)
- Backend: Railway/Render/Railway (Express + SQLite)

---

## ✅ What's Already Configured

✅ `vercel.json` - Vercel configuration file
✅ `server/index.js` - Vercel-compatible server
✅ API URLs - Environment-aware
✅ Build scripts - Ready for production

---

## 🧪 Test Your Deployment

After deployment, visit:

1. **Your app:** `https://your-project.vercel.app`
2. **API health check:** `https://your-project.vercel.app/api/health`
3. **Create a post** - Test the full functionality

---

## 🔧 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Make sure all dependencies are installed
npm install
cd client && npm install
```

### API Not Working

**Error: "Cannot connect to server"**
- Check environment variables in Vercel Dashboard
- Verify `NODE_ENV=production` is set
- Check deployment logs in Vercel Dashboard

### Database Issues

**SQLite file doesn't persist:**
- Expected behavior on Vercel (serverless)
- Consider Option C (separate backend)

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Check deployment logs in Vercel Dashboard
- See `VERCEL_DEPLOYMENT.md` for detailed guide

