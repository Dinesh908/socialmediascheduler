# Netlify Deployment Guide

This guide will help you deploy your Social Media Scheduler app to Netlify quickly and easily.

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Netlify account (free tier is fine)
- Your code pushed to GitHub

### Step 1: Push Code to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Ready for Netlify deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Netlify

**Option A: Deploy via Netlify Dashboard (Recommended)**

1. Go to [Netlify](https://www.netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize Netlify
4. Choose your repository
5. Configure build settings:
   - **Base directory**: Leave empty (or use `.`)
   - **Build command**: `npm run netlify-build`
   - **Publish directory**: `client/build`
6. Click **"Deploy site"**

**Option B: Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (first time)
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Your team
# - Site name: (choose a name or press enter for random)
# - Build command: npm run netlify-build
# - Directory to deploy: client/build

# Deploy
netlify deploy --prod
```

### Step 3: Configure Environment Variables

1. Go to your site in Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following:
   - `NODE_VERSION` = `18.17.0` (optional, Netlify will auto-detect)
   - `REACT_APP_API_URL` = `/api` (if using API proxy) or your backend URL

### Step 4: Backend Deployment (Required)

Since Netlify is primarily for static sites, you'll need to deploy your backend separately:

**Option 1: Deploy Backend to Render (Recommended - Free)**

1. Go to [Render](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `social-media-scheduler-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV` = `production`
     - `PORT` = `5000`
5. Click **"Create Web Service"**
6. Once deployed, copy your backend URL (e.g., `https://your-app.onrender.com`)

**Option 2: Deploy Backend to Railway**

1. Go to [Railway](https://railway.app) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
5. Railway will auto-detect and deploy

**Option 3: Deploy Backend to Heroku**

```bash
heroku create your-app-name-api
heroku config:set NODE_ENV=production
git push heroku main
```

### Step 5: Connect Frontend to Backend

After deploying the backend, update Netlify:

1. Go to **Site settings** → **Environment variables**
2. Update `REACT_APP_API_URL` to your backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   Or if using Render:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```

3. Or update `netlify.toml` to proxy API calls:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true
```

4. **Trigger a new deploy** (go to Deploys tab and click "Trigger deploy")

### Step 6: Configure Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

---

## 🔄 Auto-Deploy from GitHub

Netlify automatically deploys when you push to your main branch!

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Netlify will automatically:
   - Detect the push
   - Run the build command
   - Deploy the new version

---

## 📝 Netlify Configuration

The `netlify.toml` file is already configured with:

- ✅ Build command: `npm run netlify-build`
- ✅ Publish directory: `client/build`
- ✅ SPA redirects (for React Router)
- ✅ Security headers
- ✅ Cache headers for static assets

---

## 🔍 Troubleshooting

### Build Fails

**Issue**: Build command fails

**Solution**:
1. Check Netlify build logs
2. Ensure Node version is correct (Netlify should use 18.x automatically)
3. Try building locally:
   ```bash
   npm run netlify-build
   ```
4. Make sure `client/package.json` has all dependencies

### API Not Working

**Issue**: Frontend can't connect to backend

**Solution**:
1. Verify `REACT_APP_API_URL` is set correctly in Netlify
2. Check CORS settings in your backend (should allow Netlify domain)
3. Test backend directly: `https://your-backend-url.com/api/health`
4. Check browser console for errors

### Database Issues

**Issue**: SQLite not persisting data

**Solution**:
- SQLite on Render/Railway works but resets on restart
- For production, consider PostgreSQL (free tier available on Render/Railway)
- Or use a persistent volume service

### Site Shows "Page Not Found"

**Issue**: React Router routes not working

**Solution**:
- The `netlify.toml` already includes SPA redirects
- If still not working, check that redirects are active in Netlify dashboard
- Verify `_redirects` file isn't conflicting

---

## 🎯 Recommended Setup

For the easiest deployment experience:

1. **Frontend**: Netlify (this guide)
2. **Backend**: Render (free tier, easy setup)
3. **Database**: Render PostgreSQL (free tier) or keep SQLite for simple use cases

---

## 📦 Build Optimization

The current setup already includes:
- Production build optimizations via `react-scripts build`
- Static asset caching
- Security headers

To further optimize:
- Enable Netlify's image optimization
- Use Netlify Forms if you need contact forms
- Enable split testing for A/B tests

---

## 🆘 Need Help?

- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://community.netlify.com
- Check build logs in Netlify dashboard
- Verify environment variables are set correctly

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Build settings configured correctly
- [ ] Environment variables set
- [ ] Backend deployed (Render/Railway/Heroku)
- [ ] Frontend connected to backend
- [ ] Tested API endpoints
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy working

---

**You're all set!** 🎉 Your app should now be live on Netlify!

