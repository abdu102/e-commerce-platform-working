# Deployment Guide

This guide will help you deploy the E-Commerce platform to various hosting services.

## 🚀 Quick Deployment Options

### Option 1: Railway (Backend) + Vercel (Frontend) - Recommended

#### Backend Deployment (Railway)
1. **Push your code to GitHub**
2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Set the root directory to the project root (not `server`)
3. **Configure Environment Variables**
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```
4. **Deploy Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/health`

#### Frontend Deployment (Vercel)
1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - Framework Preset: Vite
     - Root Directory: `web`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-railway-backend-url.railway.app`

### Option 2: Railway (Full Stack)
1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Railway will automatically detect the monorepo structure
2. **Configure Environment Variables**
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PORT=4000
   VITE_API_URL=https://your-railway-url.railway.app
   ```

### Option 3: Docker Deployment
1. **Build and run with Docker**
   ```bash
   docker build -t ecommerce-app .
   docker run -p 4000:4000 -e DATABASE_URL=your_db_url -e JWT_SECRET=your_secret ecommerce-app
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:4000"
```

## 📦 Build Process

The application uses a monorepo structure:
- **Root**: Orchestrates both frontend and backend
- **Server**: NestJS backend with Prisma ORM
- **Web**: React frontend with Vite

### Build Commands
```bash
# Install all dependencies
npm run install:all

# Build both frontend and backend
npm run build

# Start the application
npm start
```

## 🐛 Troubleshooting

### Railway Build Issues
If you encounter build errors on Railway:

1. **TypeScript not found**: Fixed by moving TypeScript to dependencies
2. **Port conflicts**: Ensure PORT environment variable is set
3. **Database connection**: Use a proper database URL (not file:./dev.db)

### Common Issues
- **"tsc: not found"**: TypeScript is now in dependencies, not devDependencies
- **"npm run build" failed**: Check that all dependencies are properly installed
- **Database seeding**: Run `npm run setup` locally before deploying

## 🚀 Production Checklist

- [ ] Set proper environment variables
- [ ] Use production database (not SQLite file)
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS for your domain
- [ ] Set up proper logging
- [ ] Configure health checks
- [ ] Set up monitoring and alerts

## 📊 Performance Optimization

- **Database**: Use connection pooling
- **Caching**: Implement Redis for session storage
- **CDN**: Use Cloudflare or similar for static assets
- **Compression**: Enable gzip compression
- **Monitoring**: Set up application performance monitoring
