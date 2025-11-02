# Deploy to Vercel - Step by Step Guide

This guide will help you deploy your Social Media Scheduler app to Vercel.

## Option 1: Full-Stack Deployment on Vercel (Recommended)

Deploy both frontend and backend together on Vercel.

### Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- Vercel CLI installed (optional, but helpful)
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Prepare Your Project

The project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ Updated `server/index.js` - Vercel-compatible
- ✅ Environment-aware API URLs

### Step 3: Set Environment Variables

Before deploying, set these environment variables in Vercel:

**In Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Add the following:

```
NODE_ENV=production
```

**Note:** SQLite databases on Vercel are tricky because serverless functions are stateless. Consider:
- Using Vercel's KV (key-value) store for data
- Using an external database (PostgreSQL, MongoDB, etc.)
- Or use Option 2 below (separate backend)

### Step 4: Deploy via GitHub/GitLab (Recommended)

1. **Push your code to GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Vercel will auto-detect the settings
   - Click "Deploy"

### Step 5: Deploy via CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? social-media-scheduler
# - Directory? ./ (current directory)
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 6: Configure Build Settings

Vercel should auto-detect, but verify:

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `client/build`
- **Install Command:** `npm install`

If needed, update in Vercel Dashboard → Settings → General

### Step 7: Test Your Deployment

After deployment, your app will be available at:
- `https://your-project-name.vercel.app`
- Visit `/api/health` to verify API is working
- Visit root to see your React app

---

## Option 2: Frontend on Vercel + Backend on Railway/Render

If you prefer to separate frontend and backend (better for SQLite databases).

### Step 1: Deploy Frontend to Vercel

1. **Update API URL:**
   In `client/src/api.js`, the API URL should use environment variable:
   ```javascript
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Deploy to Vercel:**
   - Import project from GitHub (select `client` folder only, OR)
   - Deploy entire project but configure build:
     - **Root Directory:** `client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`
   
3. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### Step 2: Deploy Backend to Railway/Render

**Railway:**
1. Create new project
2. Connect GitHub repo
3. Set root directory: project root
4. Environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   ```
5. Deploy

**Render:**
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables:
   ```
   NODE_ENV=production
   ```

---

## Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
# Make sure all dependencies are installed
npm install
cd client && npm install
```

**Error: "Cannot find module '../server/index'"**
- Make sure `vercel.json` is in the root
- Check that server files are committed to Git

### API Not Working

**Error: "Cannot connect to server"**
- Check environment variables are set
- Verify API routes are configured in `vercel.json`
- Test `/api/health` endpoint directly

### Database Issues

**SQLite file not persisting:**
- Vercel serverless functions are stateless
- Consider using:
  - External database (PostgreSQL, MongoDB)
  - Vercel KV store
  - Separate backend deployment (Option 2)

### Fix Common Issues

1. **Routes not working:**
   - Check `vercel.json` configuration
   - Verify API routes start with `/api`

2. **Static files not loading:**
   - Verify `client/build` exists
   - Check build command completed successfully
   - Verify output directory setting

3. **CORS errors:**
   - Already handled in `server/index.js` with CORS middleware

---

## Environment Variables Checklist

Make sure these are set in Vercel Dashboard:

- ✅ `NODE_ENV=production`
- ✅ `REACT_APP_API_URL` (if using separate backend)

---

## Post-Deployment

After successful deployment:

1. **Test all features:**
   - Create a post
   - Schedule a post
   - View analytics

2. **Monitor logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Watch for any errors

3. **Set up custom domain** (optional):
   - Go to Settings → Domains
   - Add your custom domain

---

## Quick Reference

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Open deployment URL
vercel open
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check deployment logs in Vercel Dashboard

