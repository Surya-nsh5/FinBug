const multer = require('multer');
const path = require('path');

// Configure multer for CSV file uploads
// Configure multer for CSV file uploads to use memory storage (compatible with Vercel)
const storage = multer.memoryStorage();

// File filter to accept only CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
