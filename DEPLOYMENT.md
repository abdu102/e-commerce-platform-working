# 🚀 **E-commerce Platform Deployment Guide**

This guide covers deploying the e-commerce platform to various cloud platforms.

## **📋 Prerequisites**
- Node.js 18+ installed
- Git repository set up
- Railway account (free tier available)

## **🚀 Railway Deployment (Recommended)**

### **Step 1: Prepare Your Repository**
1. Ensure all changes are committed and pushed to GitHub
2. Verify your repository structure:
   ```
   ├── server/          # NestJS backend
   ├── web/            # React frontend
   ├── package.json    # Root package.json
   └── README.md
   ```

### **Step 2: Deploy to Railway**

#### **Option A: Backend + Frontend (Separate Services)**

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login with GitHub account

2. **Deploy Backend First**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Click "Deploy"

3. **Configure Backend Environment Variables**
   - Go to "Variables" tab
   - Add these variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=4000
   ```

4. **Add PostgreSQL Database**
   - Go to "Data" tab
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the PostgreSQL connection URL
   - Update `DATABASE_URL` in Variables with the new URL

5. **Deploy Frontend**
   - Create another project for frontend
   - Connect to the same repository
   - Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

#### **Option B: Full Stack (Single Service)**

1. **Deploy Full Stack**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add PostgreSQL Database**
   - Go to "Data" tab
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the PostgreSQL connection URL

3. **Configure Environment Variables**
   - Go to "Variables" tab
   - Add these variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=4000
   VITE_API_URL=https://your-app-url.railway.app
   ```

### **Step 3: Database Setup**

1. **Run Database Migrations**
   - Railway will automatically run `npm run build`
   - Add this to your build script in `package.json`:
   ```json
   "build": "npx tsc -p tsconfig.json && npm run prisma:generate"
   ```

2. **Seed Database (Optional)**
   - Add this to your start script:
   ```json
   "start": "npm run prisma:deploy && node dist/main.js"
   ```

### **Step 4: Verify Deployment**

1. **Check Backend Health**
   - Visit: `https://your-app-url.railway.app/health`
   - Should return: `{"status":"ok"}`

2. **Test Frontend**
   - Visit your Railway app URL
   - Test registration, login, and product browsing

## **🐳 Docker Deployment**

### **Step 1: Create Dockerfile**
```dockerfile
# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY web/package*.json ./web/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd web && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
```

### **Step 2: Build and Run**
```bash
# Build Docker image
docker build -t ecommerce-app .

# Run container
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  ecommerce-app
```

## **🔧 Environment Variables**

### **Backend Variables**
```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
PORT=4000
```

### **Frontend Variables**
```bash
VITE_API_URL=https://your-backend-url.railway.app
```

## **📊 Production Checklist**

- [ ] PostgreSQL database configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] JWT secret configured
- [ ] CORS settings updated
- [ ] Frontend API URL configured
- [ ] Health check endpoint working
- [ ] SSL/HTTPS enabled (Railway handles this)

## **🚨 Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is correct
   - Check if PostgreSQL is running
   - Ensure database exists

2. **Build Failed**
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Check for syntax errors

3. **Frontend Can't Connect to Backend**
   - Verify `VITE_API_URL` is correct
   - Check CORS settings
   - Ensure backend is running

4. **Authentication Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Ensure user registration works

### **Performance Optimization**

1. **Database Optimization**
   - Add indexes to frequently queried fields
   - Use connection pooling
   - Monitor query performance

2. **Frontend Optimization**
   - Enable code splitting
   - Optimize bundle size
   - Use CDN for static assets

3. **Backend Optimization**
   - Enable compression
   - Use caching strategies
   - Monitor memory usage

## **🔗 Useful Links**

- [Railway Documentation](https://docs.railway.app/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)

## **📝 Notes**

- Railway provides automatic HTTPS
- PostgreSQL is recommended for production
- Environment variables are encrypted
- Automatic deployments on git push
- Built-in monitoring and logging
