# Deployment Guide

This guide will help you deploy the E-Commerce platform to various hosting services.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)
1. **Push your code to GitHub**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - Framework Preset: Vite
     - Build Command: `cd web && npm run build`
     - Output Directory: `web/dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

#### Backend Deployment (Railway)
1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Set the root directory to `server`
2. **Configure Environment Variables**
   ```
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-secure-jwt-secret
   PORT=4000
   ```
3. **Deploy**

### Option 2: Heroku

#### Backend Deployment
1. **Install Heroku CLI**
2. **Login to Heroku**
   ```bash
   heroku login
   ```
3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```
4. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set JWT_SECRET=your-secure-jwt-secret
   ```
5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment
1. **Build the frontend**
   ```bash
   cd web
   npm run build
   ```
2. **Deploy to Netlify/Vercel** with the `dist` folder

### Option 3: DigitalOcean App Platform

1. **Create a new app**
2. **Connect your GitHub repository**
3. **Configure the backend service**
   - Source Directory: `server`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
4. **Configure the frontend service**
   - Source Directory: `web`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secure-jwt-secret"
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL="https://your-backend-url.com"
```

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL (Recommended)
1. Create a new PostgreSQL service on Railway
2. Copy the connection URL
3. Set as `DATABASE_URL` in your backend environment

### Option 2: Supabase
1. Create a new project on Supabase
2. Get the connection string
3. Set as `DATABASE_URL`

### Option 3: PlanetScale
1. Create a new database on PlanetScale
2. Get the connection string
3. Set as `DATABASE_URL`

## 🔐 Security Considerations

### Production Checklist
- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Use HTTPS for all API calls
- [ ] Set up proper CORS configuration
- [ ] Use a production database (PostgreSQL/MySQL)
- [ ] Set up proper logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up SSL certificates

### Environment Variables Security
- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Rotate secrets regularly
- Use different secrets for different environments

## 📊 Monitoring and Logging

### Recommended Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring
- **Datadog** - Infrastructure monitoring

## 🚀 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images
- Use service workers for caching

### Backend
- Enable database connection pooling
- Implement caching (Redis)
- Use compression middleware
- Optimize database queries
- Set up proper indexing

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd server && npm install
      - run: cd server && npm run build
      # Add deployment steps for your platform

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd web && npm install
      - run: cd web && npm run build
      # Add deployment steps for your platform
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your backend CORS configuration includes your frontend domain
   - Check that the API URL is correct

2. **Database Connection Issues**
   - Verify the `DATABASE_URL` is correct
   - Ensure the database is accessible from your deployment platform
   - Run database migrations: `npx prisma migrate deploy`

3. **Build Failures**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Check for TypeScript compilation errors

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check that variable names match exactly
   - Restart the application after changing environment variables

## 📞 Support

If you encounter issues during deployment:
1. Check the platform's documentation
2. Review the logs for error messages
3. Verify all environment variables are set correctly
4. Test locally before deploying

---

**Note**: This is a development project. For production use, consider implementing additional security measures and monitoring solutions.
