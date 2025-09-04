const express = require("express");
const app = express();
// Use Express built-in body parsers
const Jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');
const xss = require('xss-clean');
app.use(xss());
const mongoSanitize = require('express-mongo-sanitize');

app.use(mongoSanitize());
const helmet = require('helmet');

app.use(helmet());
const rateLimit = require('express-rate-limit');

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
  message: "Too many requests from this IP, try again later"
}));


const cookieParser = require("cookie-parser");
require("./config/utils/borrowReminder.js");
// Load environment variables from the backend folder's .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(cookieParser());

// Import routes
const userRouter = require("./config/routes/admin/User");
const dashboardRouter = require("./config/routes/admin/Dashboard");
const booksRouter = require("./config/routes/admin/books");
const getBooksRouter = require("./config/routes/web/getbooks");
const searchRouter = require("./config/routes/web/search");
const reviewRouter = require("./config/routes/web/Review");
const BorrowRouter = require("./config/routes/admin/Borrow");
const forgetRouter =require("./config/routes/admin/forgetpassword")


// Get the current directory path
const currentDir = path.resolve();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(currentDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Middleware
// Allow common local dev origins. In production, set a stricter list via env.
const devAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : devAllowedOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    // Allow any localhost origin in development to simplify hot-reload ports
    if (process.env.NODE_ENV !== 'production' && /^(https?:)?\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,   // ✅ cookies/authorization headers allowed
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} - Origin: ${req.headers.origin} - Auth: ${req.headers.authorization ? 'Yes' : 'No'}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed"
    });
  }
  next(err);
});

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/auth", userRouter);
app.use("/api/auth", dashboardRouter);
app.use("/api/auth", booksRouter);
app.use("/api/web", getBooksRouter);
app.use("/api/web", searchRouter);
// forget password 
app.use("/api/admin/" ,forgetRouter);
// Review routes - mount once with proper path handling
app.use("/api/web/reviews", reviewRouter);
// get approved status 
app.use("/api/auth/reviews", reviewRouter);
// show all books for admin 


// Fallback direct route to ensure borrow endpoint is reachable
app.use("/api/auth/borrow", BorrowRouter);

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend working fine ✅");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});