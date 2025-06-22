const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware"); // your multer middleware

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`; // 🖼️ Public URL

    res.status(200).json({
      message: "Image uploaded successfully",
      file: req.file,
      url: imageUrl, // ✅ Add this to response
    });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error });
  }
});




module.exports = router;
