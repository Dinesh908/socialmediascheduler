# Deployment Guide

This guide covers deploying the Social Media Scheduler application to various platforms.

## Pre-Deployment Checklist

1. ✅ Build the React app: `npm run build`
2. ✅ Test production build locally
3. ✅ Set environment variables
4. ✅ Ensure database directory has write permissions

## Deployment Options

### Option 1: Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps

1. **Install Heroku CLI** (if not installed):
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create a Heroku app**:
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Add Procfile** (create if not exists):
   ```
   web: node server/index.js
   ```

6. **Deploy**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push heroku main
   ```

#### Heroku-Specific Notes
- SQLite may have issues on Heroku (ephemeral filesystem). Consider PostgreSQL for production.
- Build will run automatically on deploy
- Database will reset on dyno restart (consider external database)

---

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. **Build React app**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Or use Vercel dashboard and connect your GitHub repo

3. **Environment Variables** (in Vercel dashboard):
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

#### Backend on Railway or Render

**Railway:**
1. Connect your GitHub repo
2. Set root directory to project root
3. Set start command: `npm start`
4. Set environment variable: `NODE_ENV=production`

**Render:**
1. Create new Web Service
2. Connect repository
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Set environment: `NODE_ENV=production`

---

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Select Node.js
3. Build command: `npm install && npm run build`
4. Run command: `npm start`
5. Set environment variables:
   ```
   NODE_ENV=production
   PORT=8080
   ```

---

### Option 4: Self-Hosted (VPS)

#### Prerequisites
- Linux VPS (Ubuntu recommended)
- Node.js and npm installed
- PM2 for process management

#### Steps

1. **Install Node.js and PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone and setup**:
   ```bash
   git clone your-repo-url
   cd social-media-scheduler
   npm install
   npm run build
   ```

3. **Start with PM2**:
   ```bash
   NODE_ENV=production pm2 start server/index.js --name social-scheduler
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Production Build

### Build Frontend
```bash
cd client
npm run build
```

This creates optimized production files in `client/build/`

### Test Production Build Locally
```bash
NODE_ENV=production npm start
```

Then visit `http://localhost:5000`

---

## Environment Variables

Create a `.env` file (or set in your hosting platform):

```
NODE_ENV=production
PORT=5000
REACT_APP_API_URL=/api
```

For separate frontend/backend deployment:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Database Considerations

⚠️ **Important**: SQLite is not ideal for production deployments with multiple instances.

### Options:
1. **Keep SQLite** (single instance only)
   - Works for small deployments
   - Database file location: `server/database/scheduler.db`
   - Ensure write permissions

2. **Upgrade to PostgreSQL** (recommended for production)
   - Better for scaling
   - Works with Heroku, Railway, Render
   - Requires database migration

---

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules build
npm install
npm run build
```

### Server Not Starting
- Check PORT environment variable
- Ensure `client/build` directory exists
- Check database file permissions

### API Not Working
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in production
- Ensure backend is accessible

### Database Errors
- Check write permissions on database directory
- Ensure database file path is correct
- For SQLite, ensure file persistence in deployment platform

---

## Quick Deploy Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && npm start",
    "deploy:heroku": "git push heroku main"
  }
}
```

---

## Need Help?

- Check server logs: `heroku logs --tail` (Heroku)
- Check build logs in deployment platform
- Verify environment variables are set
- Test API endpoint: `/api/health`

