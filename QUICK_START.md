# Quick Start Guide

## Issue: Connection Errors

If you see "Failed to save post" or "Failed to load posts" errors, it means the backend server isn't running.

## Solution

### Step 1: Start the Backend Server

Open a terminal in the project root directory and run:

```bash
npm run server
```

You should see:
```
Server is running on port 5000
Connected to SQLite database
```

**Keep this terminal window open** - the server needs to keep running.

### Step 2: Start the Frontend (in a new terminal)

Open a **new terminal** window in the project root directory and run:

```bash
npm run client
```

The React app will open automatically at `http://localhost:3000`

### Alternative: Run Both Together

If you prefer to run both servers together, use:

```bash
npm run dev
```

This will start both the backend and frontend concurrently.

---

## Verifying the Server is Running

You can test if the backend is running by visiting:
http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "Social Media Scheduler API is running"
}
```

## Troubleshooting

1. **Port 5000 already in use?**
   - Change the PORT in `server/index.js` or set an environment variable

2. **Database errors?**
   - Make sure you have write permissions in the `server/database/` directory
   - The database file will be created automatically

3. **Still having issues?**
   - Make sure all dependencies are installed: `npm install` in the root and `cd client && npm install`

