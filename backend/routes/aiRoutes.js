const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkInsightsLimit, getUsageStats } = require('../middleware/rateLimitMiddleware');
const {
  getFinancialAnalysis,
  getCachedAnalysis,
  predictExpenses,
  analyzeSpending,
  getFinancialHealthScore
} = require('../controllers/aiPredictionController');

/**
 * @route   POST /api/v1/ai/analyze
 * @desc    Get comprehensive AI financial analysis with predictions and insights
 * @access  Private
 */
router.post('/analyze', protect, checkInsightsLimit, getFinancialAnalysis);

/**
 * @route   POST /api/v1/ai/predict-expenses
 * @desc    Predict next month's expenses
 * @access  Private
 */
router.post('/predict-expenses', protect, checkInsightsLimit, predictExpenses);

/**
 * @route   POST /api/v1/ai/analyze-spending
 * @desc    Analyze spending patterns and get recommendations
 * @access  Private
 */
router.post('/analyze-spending', protect, checkInsightsLimit, analyzeSpending);

/**
 * @route   GET /api/v1/ai/health-score
 * @desc    Get financial health score
 * @access  Private
 */
router.get('/health-score', protect, checkInsightsLimit, getFinancialHealthScore);

/**
 * @route   GET /api/v1/ai/cached-analysis
 * @desc    Get cached AI analysis (doesn't count towards daily limit)
 * @access  Private
 */
router.get('/cached-analysis', protect, getCachedAnalysis);

/**
 * @route   GET /api/v1/ai/usage-stats
 * @desc    Get current AI usage statistics
 * @access  Private
 */
router.get('/usage-stats', protect, getUsageStats);

module.exports = router;
