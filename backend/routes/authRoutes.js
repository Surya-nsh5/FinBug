const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserInfo,
  updateUser,
} = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.put("/update-user", protect, updateUser);

// Upload Image (Serverless compatible - sends back Data URI)
router.post("/upload-image", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Convert buffer to base64
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const mimeType = req.file.mimetype;
  const imageUrl = `data:${mimeType};base64,${b64}`;

  // Note: multiple large base64 strings can slow down the DB. 
  // In a real production app, use Cloudinary/S3. 
  // For this fix, we use Data URIs to ensure it works on Vercel without FS.

  res.status(200).json({ imageUrl });
});

module.exports = router;
