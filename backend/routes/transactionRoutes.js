const express = require("express");
const {
    bulkUploadUnified
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/csvUploadMiddleware");

const router = express.Router();

router.post("/bulk-upload", protect, upload.single('file'), bulkUploadUnified);

module.exports = router;
