# FinBug

AI-powered personal finance tracker built with React, Node.js, Express, and MongoDB.

## Features

- 📊 Track income and expenses
- 🤖 AI-powered financial insights
- 📈 Interactive charts and analytics
- 📱 Progressive Web App (PWA) support
- 🔐 Secure authentication
- 📄 Bill scanning with AI
- 📥 CSV bulk upload/download

## Tech Stack

**Frontend:**
- React 19
- Vite
- TailwindCSS
- Recharts
- Axios

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- Google Gemini AI

## Deployment

- **Frontend**: Netlify
- **Backend**: Vercel
- **Database**: MongoDB Atlas

## Environment Variables

### Frontend (Netlify)
Set these in Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_API_BASE_URL` - Your backend URL (e.g., https://your-backend.vercel.app)
- `VITE_WEB3FORMS_ACCESS_KEY` - Web3Forms API key (optional)

### Backend (Vercel)
Set these in Vercel Dashboard → Project Settings → Environment Variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `GEMINI_API_KEY` - Google Gemini API key
- `CLIENT_URL` - Frontend URL (https://finbug.netlify.app)
- `PORT` - Port number (default: 5000)

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend/finance-tracker
npm install
npm run dev
```

## License

MIT
