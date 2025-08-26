const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage with custom filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const { title = "book", author = "unknown" } = req.body;
    const safe = (str) => String(str).toLowerCase().replace(/[^a-z0-9-_]+/g, "_").slice(0, 50);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${safe(title)}-${safe(author)}-${Date.now()}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("File upload only supports jpeg, jpg, png, gif"));
  }
};

// Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 3 }, // 3MB
});

// Middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload.single("coverImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large! Please select a file smaller than 3MB.",
        });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "Server error!" });
    }
    next();
  });
};

// Export the middleware
module.exports = uploadMiddleware;
