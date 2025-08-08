# 🚀 **E-commerce Platform Deployment Guide**

This guide covers deploying the e-commerce platform to Railway and Vercel.

## **📋 Prerequisites**
- Node.js 18+ installed
- Git repository set up
- Railway account (free tier available)
- Vercel account (free tier available)

## **🚀 Railway Deployment (Backend API)**

### **Step 1: Go to Railway Dashboard**
1. Open browser → **https://railway.app**
2. Login with GitHub account

### **Step 2: Create New Project**
1. Click **"New Project"** (big blue button)
2. Select **"Deploy from GitHub repo"**
3. Find and click **`e-commerce-platform-working`**
4. Click **"Deploy"**

### **Step 3: Add PostgreSQL Database**
1. In your project dashboard, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Wait for it to be created (green checkmark)

### **Step 4: Configure Environment Variables**
1. Click on your **GitHub service** (not the Postgres one)
2. Go to **"Variables"** tab
3. Add these variables exactly:
   ```
   DATABASE_URL = Click "Reference" → Select your Postgres service → DATABASE_URL
   JWT_SECRET = your-super-secret-jwt-key-here-12345
   PORT = 4000
   NODE_ENV = production
   ```

### **Step 5: Run Database Migrations**
1. In your GitHub service, go to **"Settings"** → **"Commands"**
2. Add this command:
   ```
   npx prisma migrate deploy
   ```
3. Click **"Deploy"** to run migrations

### **Step 6: Get Your Backend URL**
1. In your GitHub service, go to **"Settings"** → **"Networking"**
2. Copy the **Public URL** (looks like `https://xxxx.up.railway.app`)
3. Test it: Visit `https://your-url.railway.app/health` (should show `{"status":"ok"}`)

## **🎨 Vercel Deployment (Frontend)**

### **Step 1: Go to Vercel**
1. Open browser → **https://vercel.com**
2. Login with GitHub account

### **Step 2: Import Project**
1. Click **"New Project"**
2. Import your GitHub repo: **`e-commerce-platform-working`**

### **Step 3: Configure Build Settings**
1. Set **Root Directory**: `web`
2. Set **Build Command**: `npm run build`
3. Set **Output Directory**: `dist`
4. Set **Install Command**: `npm install`

### **Step 4: Add Environment Variable**
1. In **Environment Variables** section, add:
   ```
   VITE_API_URL = Your Railway backend URL (from Step 6)
   ```

### **Step 5: Deploy**
1. Click **"Deploy"**
2. Wait for build to complete

## **🔧 Troubleshooting Railway Issues**

### **If "Network Process Failed":**
1. **Check Environment Variables:**
   - Go to your GitHub service → Variables
   - Ensure `DATABASE_URL` is set (click "Reference" → Postgres → DATABASE_URL)
   - Ensure `JWT_SECRET` is set
   - Ensure `PORT` is set to `4000`

2. **Check Database Connection:**
   - Go to Postgres service → Connect → Copy connection string
   - Verify it's in your `DATABASE_URL`

3. **Run Migrations:**
   - Go to GitHub service → Settings → Commands
   - Add: `npx prisma migrate deploy`
   - Click Deploy

4. **Clear Cache and Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" with "Clear cache" enabled

### **If Build Fails:**
1. **Check Logs:**
   - Go to Deployments → Click latest deployment → View logs
   - Look for specific error messages

2. **Common Fixes:**
   - Ensure all environment variables are set
   - Check that PostgreSQL is running
   - Verify the service is using the correct port

## **✅ Testing Your Deployment**

### **Backend Test:**
```bash
curl https://your-railway-url.railway.app/health
# Should return: {"status":"ok"}
```

### **Frontend Test:**
1. Visit your Vercel URL
2. Try to register/login
3. Check if products load
4. Test cart functionality

## **🔗 Final URLs**
- **Backend API**: `https://your-app.railway.app`
- **Frontend**: `https://your-app.vercel.app`

## **📝 Environment Variables Summary**

### **Railway (Backend):**
```
DATABASE_URL = postgresql://... (from Railway Postgres)
JWT_SECRET = your-secret-key
PORT = 4000
NODE_ENV = production
```

### **Vercel (Frontend):**
```
VITE_API_URL = https://your-railway-url.railway.app
```

## **🚨 Common Issues & Solutions**

1. **"Network Process Failed"**
   - Check environment variables
   - Ensure PostgreSQL is connected
   - Run database migrations

2. **"Build Failed"**
   - Check Railway logs for specific errors
   - Ensure all dependencies are installed
   - Verify TypeScript compilation

3. **"Database Connection Failed"**
   - Check DATABASE_URL format
   - Ensure PostgreSQL service is running
   - Run `npx prisma migrate deploy`

4. **"Frontend Can't Connect to Backend"**
   - Check VITE_API_URL in Vercel
   - Ensure backend URL is correct
   - Test backend health endpoint

## **📞 Support**
If you encounter issues:
1. Check Railway logs in the Deployments tab
2. Verify all environment variables are set
3. Ensure database migrations have run
4. Test backend health endpoint manually
