# FinBug Deployment Guide

## 🚨 Current Issue

Your frontend is deployed on **Netlify** (`https://finbug.netlify.app`), but it's trying to make API calls to itself. Netlify only hosts static files and doesn't have your backend API routes.

**Error:** `POST https://finbug.netlify.app/api/v1/auth/login 404 (Not Found)`

## ✅ Solution: Deploy Backend Separately

You need to deploy your backend to a separate platform and configure the frontend to point to it.

---

## 📦 Backend Deployment Options

### **Option 1: Vercel (Recommended - Already Configured)**

You already have `vercel.json` configured! Follow these steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project
   - Choose production deployment

4. **Note your backend URL** (e.g., `https://finbug-backend.vercel.app`)

5. **Set environment variables on Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `GEMINI_API_KEY`
     - `CLIENT_URL` = `https://finbug.netlify.app`

---

### **Option 2: Render (Free Tier Available)**

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `backend` directory
   - Configure:
     - **Name**: `finbug-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` = `https://finbug.netlify.app`
   - `PORT` = `5000`

4. **Deploy** and note your backend URL (e.g., `https://finbug-backend.onrender.com`)

---

### **Option 3: Railway (Free Tier Available)**

1. **Create account** at [railway.app](https://railway.app)

2. **New Project** → Deploy from GitHub

3. **Configure**:
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables

4. **Deploy** and note your backend URL

---

## 🔧 Frontend Configuration

After deploying your backend, configure the frontend:

### **Step 1: Update Netlify Environment Variables**

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**

2. Add the following variable:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-url.com
   ```
   Replace `https://your-backend-url.com` with your actual backend URL from Vercel/Render/Railway

### **Step 2: Rebuild and Redeploy**

1. **Trigger a new deploy** in Netlify:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

   OR push a new commit to trigger auto-deployment:
   ```bash
   git add .
   git commit -m "Configure backend URL"
   git push
   ```

---

## 🧪 Testing Locally

To test the full stack locally:

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   Backend runs on `http://localhost:5000`

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend/finance-tracker
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

The frontend will automatically use `http://localhost:5000` for API calls in development mode.

---

## 📝 Quick Checklist

- [ ] Deploy backend to Vercel/Render/Railway
- [ ] Note the backend URL
- [ ] Add `VITE_API_BASE_URL` to Netlify environment variables
- [ ] Redeploy frontend on Netlify
- [ ] Test login/signup functionality
- [ ] Verify API calls are going to the correct backend URL

---

## 🔍 Debugging

If you still get 404 errors:

1. **Check browser console** for the API URL being called
2. **Verify environment variable** is set correctly in Netlify
3. **Check backend logs** for incoming requests
4. **Test backend directly** by visiting `https://your-backend-url.com/api/v1/auth/login` (should return 404 or method not allowed, not connection error)
5. **Clear browser cache** and hard refresh (`Ctrl + Shift + R`)

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Render Deployment Docs](https://render.com/docs)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
