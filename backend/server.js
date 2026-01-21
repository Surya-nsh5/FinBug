require('dotenv').config();
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

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "https://finbug.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb', charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/bill", billScanRoutes);

// Server uploads folder - Not used in Serverless/Memory Storage mode
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/finance-tracker/build')));

// Catch-all handler: send back React's index.html for any request that doesn't match API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/finance-tracker/build/index.html'));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;