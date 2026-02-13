require('dotenv').config(); // Load env vars
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const billScanRoutes = require("./routes/billScanRoutes");
const transactionRoutes = require("./routes/transactionRoutes");


// Force restart to load env vars
const app = express();

// CORS configuration - Robust for Vercel/Production deployment
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://finbug.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);

    // Check if origin is in the allowed list
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false;
      // Case-insensitive comparison and trailing slash check
      const normalizedAllowed = allowed.toLowerCase().replace(/\/$/, "");
      const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
      return normalizedAllowed === normalizedOrigin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(null, false); // Don't throw error, just tell cors it's not allowed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options(/.*/, cors(corsOptions));

// Compression middleware for responses
const compression = require('compression');
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Compression level (0-9, 6 is default)
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Response time header for monitoring - Removed to fix ERR_HTTP_HEADERS_SENT
// The 'finish' event happens after headers are sent, causing a crash when trying to set a new header.
app.use((req, res, next) => {
  // Simple pass-through
  next();
});

app.use(express.json({ limit: '10mb', charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Connect to Database
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/bill", billScanRoutes);
app.use("/api/v1/transaction", transactionRoutes);

// Server uploads folder - Not used in Serverless/Memory Storage mode
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Note: Static file serving removed for Vercel deployment
// Frontend is deployed separately on Vercel

const PORT = process.env.PORT || 5000;

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running successfully" });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;