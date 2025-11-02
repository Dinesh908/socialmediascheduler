# GitHub Setup & Deployment Guide

Quick guide to set up GitHub and deploy to Netlify.

## 🚀 Initial GitHub Setup (First Time Only)

### Step 1: Initialize Git (if not already done)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Social Media Scheduler ready for Netlify deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `social-media-scheduler`)
3. **Don't** initialize with README, .gitignore, or license (you already have these)
4. Click "Create repository"

### Step 3: Connect and Push

```bash
# Add GitHub remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🔄 Making Changes & Updating GitHub

### Quick Push (3 commands)

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Your commit message"

# Push to GitHub (auto-deploys to Netlify!)
git push origin main
```

### Example Workflow

```bash
# Make your code changes...

# Stage changes
git add .

# Commit
git commit -m "Added new feature: [feature name]"

# Push (triggers Netlify auto-deploy)
git push origin main
```

## 📦 What Gets Committed

The following are **automatically ignored** (won't be committed):
- `node_modules/` (dependencies)
- `client/build/` (build output)
- `server/database/*.db` (database files)
- `.env` files (environment variables)
- `.netlify/` (Netlify cache)

**Everything else** will be committed to GitHub.

## ⚡ Auto-Deploy to Netlify

Once you've connected Netlify to your GitHub repository:

1. **Every push to `main` branch** automatically triggers a Netlify deployment
2. **Netlify will**:
   - Detect the push
   - Run `npm run netlify-build`
   - Deploy to `https://your-site.netlify.app`
   - Send you a notification when done

## 🔍 Check Status

### See what changed:
```bash
git status
```

### See commit history:
```bash
git log --oneline
```

### See current branch:
```bash
git branch
```

## 🛠️ Common Git Commands

```bash
# Check status
git status

# Add specific file
git add filename.js

# Undo changes to a file (before commit)
git checkout -- filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View changes
git diff

# Pull latest from GitHub
git pull origin main
```

## ⚠️ Important Notes

1. **Always pull before pushing** if working with others:
   ```bash
   git pull origin main
   git push origin main
   ```

2. **Environment variables** should be set in Netlify dashboard, not committed to GitHub

3. **Database files** are not committed (they're in .gitignore)

4. **Build outputs** are generated during deployment, not committed

## 🎯 Quick Checklist

Before your first deployment:

- [ ] Git initialized (`git init`)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub (`git push`)
- [ ] Netlify connected to GitHub
- [ ] Build settings configured
- [ ] Environment variables set in Netlify
- [ ] Backend deployed (Render/Railway)
- [ ] Frontend connected to backend

## 🆘 Troubleshooting

### "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Updates were rejected"
```bash
git pull origin main --rebase
git push origin main
```

### Forgot to add files
```bash
git add .
git commit --amend --no-edit
git push origin main --force
```

---

**That's it!** You're now set up for easy GitHub deployments. 🎉

