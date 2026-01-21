# Netlify Environment Variable Setup

## 🚨 Fix for 404 API Errors

Your frontend on Netlify is getting 404 errors because it doesn't know where your backend is deployed.

---

## ✅ Solution: Set Environment Variable in Netlify

### **Step 1: Get Your Backend URL**

Your backend is deployed on Vercel. The URL should look like:
- `https://finbug-backend.vercel.app`
- `https://finbug-api.vercel.app`
- Or whatever you named it on Vercel

**To find it:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your backend project
3. Copy the **Production URL** (e.g., `https://your-project.vercel.app`)

---

### **Step 2: Add Environment Variable in Netlify**

1. Go to **[Netlify Dashboard](https://app.netlify.com)**
2. Click on your **FinBug** site
3. Go to **Site settings** (in the top navigation)
4. Click **Environment variables** (in the left sidebar under "Build & deploy")
5. Click **Add a variable** or **Add environment variables**
6. Enter:
   ```
   Key:   VITE_API_BASE_URL
   Value: https://your-backend-url.vercel.app
   ```
   ⚠️ **Important**: Replace `https://your-backend-url.vercel.app` with your actual Vercel backend URL
7. Select **All scopes** (or at least "Production" and "Deploy previews")
8. Click **Create variable** or **Save**

---

### **Step 3: Redeploy Your Site**

After adding the environment variable, you MUST redeploy:

**Option A: From Netlify Dashboard**
1. Go to **Deploys** tab
2. Click **Trigger deploy** dropdown
3. Select **Clear cache and deploy site**

**Option B: Push to Git (Automatic)**
```bash
git add .
git commit -m "Update environment variable setup"
git push
```

This will automatically trigger a new deployment on Netlify.

---

## 🧪 Verify It's Working

After redeployment:

1. Open your site: `https://finbug.netlify.app`
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Try to login
5. Check the **Network** tab:
   - The API calls should now go to `https://your-backend.vercel.app/api/v1/...`
   - They should return **200 OK** instead of **404**

---

## 🔍 Troubleshooting

### Still getting 404 errors?

1. **Check environment variable is set correctly**:
   - Go to Netlify → Site settings → Environment variables
   - Verify `VITE_API_BASE_URL` is there with the correct URL

2. **Make sure you redeployed**:
   - Environment variables only take effect on NEW deployments
   - Check Netlify → Deploys → Make sure there's a new deploy after you added the variable

3. **Check the URL format**:
   - ✅ Correct: `https://your-backend.vercel.app` (no trailing slash)
   - ❌ Wrong: `https://your-backend.vercel.app/` (has trailing slash)
   - ❌ Wrong: `http://your-backend.vercel.app` (should be https)

4. **Test backend directly**:
   - Visit `https://your-backend.vercel.app/api/v1/auth/login` in browser
   - You should get a response (even if it's an error, it means the backend is reachable)

5. **Clear browser cache**:
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

---

## 📝 Quick Checklist

- [ ] Found my Vercel backend URL
- [ ] Added `VITE_API_BASE_URL` to Netlify environment variables
- [ ] Triggered a new deployment on Netlify
- [ ] Waited for deployment to complete
- [ ] Cleared browser cache and tested login
- [ ] Verified API calls go to correct backend URL in Network tab

---

## 💡 For Local Development

For local development, the `.env` file is already configured:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

Just run:
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend/finance-tracker
npm run dev
```

The frontend will use `http://localhost:5000` automatically.
