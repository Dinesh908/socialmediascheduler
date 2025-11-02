# Social Media Scheduler

A full-stack social media scheduling application that allows users to create posts, schedule them for different platforms (Facebook, Twitter, Instagram), and track engagement with an analytics dashboard.

## Features

- ✅ **Post Management**: Create, edit, and delete posts with optional media URLs
- ✅ **Multi-Platform Scheduling**: Schedule posts for Facebook, Twitter, and Instagram
- ✅ **Status Tracking**: Track post status (pending, published, failed)
- ✅ **Analytics Dashboard**: Monitor engagement metrics including likes, shares, comments, views, clicks, and engagement rates
- ✅ **Platform-Specific Analytics**: View analytics broken down by platform
- ✅ **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **SQLite** database
- RESTful API architecture

### Frontend
- **React** with modern hooks
- **Axios** for API calls
- Custom CSS with responsive design

## Installation

1. **Clone or download this repository**

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

   Or use the convenience script:
   ```bash
   npm run install-all
   ```

## Running the Application

### Option 1: Run Both Servers Together
```bash
npm run dev
```

This will start both the backend server (port 5000) and the React frontend (port 3000) concurrently.

### Option 2: Run Separately

**Backend Server:**
```bash
npm run server
```
Backend runs on `http://localhost:5000`

**Frontend:**
```bash
npm run client
```
Frontend runs on `http://localhost:3000` (opens automatically in your browser)

## Usage

1. **Create Posts**: Navigate to the "Posts" tab and create new posts with content and optional media URLs.

2. **Schedule Posts**: Go to the "Schedule" tab to schedule your posts for Facebook, Twitter, or Instagram. Select a post, choose a platform, and set the scheduled time.

3. **Track Analytics**: Visit the "Analytics" tab to:
   - View overall engagement statistics
   - See platform-specific analytics
   - Add analytics data for published posts
   - Monitor engagement rates and metrics

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get a single schedule
- `GET /api/schedules/platform/:platform` - Get schedules by platform
- `POST /api/schedules` - Create a new schedule
- `PUT /api/schedules/:id` - Update a schedule
- `DELETE /api/schedules/:id` - Delete a schedule

### Analytics
- `GET /api/analytics` - Get all analytics
- `GET /api/analytics/schedule/:scheduleId` - Get analytics for a schedule
- `GET /api/analytics/platform/:platform` - Get analytics by platform
- `GET /api/analytics/dashboard/summary` - Get dashboard summary
- `POST /api/analytics` - Create analytics data
- `PUT /api/analytics/:id` - Update analytics data

## Database

The application uses SQLite with the following tables:
- **posts**: Stores post content and metadata
- **schedules**: Stores scheduling information for posts
- **analytics**: Stores engagement metrics for published posts

The database file (`scheduler.db`) is automatically created in the `server/database` directory on first run.

## Project Structure

```
social-media-scheduler/
├── server/
│   ├── database/
│   │   └── db.js          # Database setup and queries
│   ├── routes/
│   │   ├── posts.js       # Post routes
│   │   ├── schedules.js   # Schedule routes
│   │   └── analytics.js    # Analytics routes
│   └── index.js           # Express server
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostForm.js
│   │   │   ├── PostList.js
│   │   │   ├── ScheduleManager.js
│   │   │   ├── AnalyticsDashboard.js
│   │   │   └── AnalyticsForm.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── api.js         # API client
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Deployment

The application is ready for deployment! Multiple deployment options are available.

### 🚀 Netlify Deployment (Recommended - Easiest)

**Quick Start:** See [NETLIFY_QUICK_START.md](./NETLIFY_QUICK_START.md) for 5-minute deployment.

**Full Guide:** See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

1. Push to GitHub
2. Connect to Netlify (auto-detects settings from `netlify.toml`)
3. Deploy backend to Render/Railway
4. Set environment variables
5. Done! 🎉

Auto-deploy is configured - every push to `main` branch automatically deploys!

### Other Deployment Options

See `DEPLOYMENT.md` for:
- Heroku deployment
- Vercel deployment  
- Railway/Render deployment
- Self-hosted options

### Quick Deploy (Manual)

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Set environment variables**:
   ```bash
   NODE_ENV=production
   PORT=5000
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

## Future Enhancements

- Real-time post publishing integration with social media APIs
- Automated analytics collection
- Bulk scheduling
- Post templates
- Content calendar view
- Email notifications
- User authentication and multi-user support

## License

MIT
# social-media-scheduler12
# social-media-scheduler2
# social-media-scheduler2
