const express = require("express");
const app = express();
const Jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// 🔒 Security middlewares
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// Load background jobs
require("./config/utils/borrowReminder.js");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ✅ Security middlewares
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000,
    message: "Too many requests from this IP, try again later",
  })
);

app.use(cookieParser());

// ---------------------
// 📂 Static Uploads Setup
// ---------------------
const currentDir = path.resolve();
const uploadsDir = path.join(currentDir, "uploads");

// Create uploads dir if missing
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static uploads with CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsDir)
);

// ---------------------
// 🌐 CORS Setup
// ---------------------
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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Allow localhost in dev
      if (
        process.env.NODE_ENV !== "production" &&
        /^(https?:)?\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Debug requests
app.use((req, res, next) => {
  console.log(
    `🔍 ${req.method} ${req.path} - Origin: ${req.headers.origin} - Auth: ${
      req.headers.authorization ? "Yes" : "No"
    }`
  );
  next();
});

// ---------------------
// 📦 Routes
// ---------------------
const userRouter = require("./config/routes/admin/User");
const dashboardRouter = require("./config/routes/admin/Dashboard");
const booksRouter = require("./config/routes/admin/books");
const getBooksRouter = require("./config/routes/web/getbooks");
const searchRouter = require("./config/routes/web/search");
const reviewRouter = require("./config/routes/web/Review");
const BorrowRouter = require("./config/routes/admin/Borrow");
const forgetRouter = require("./config/routes/admin/forgetpassword");
const borrowtreRouter= require("./config/routes/admin/brotrending")

app.use("/api/auth", userRouter);
app.use("/api/auth", dashboardRouter);
app.use("/api/auth", booksRouter);
app.use("/api/web", getBooksRouter);
app.use("/api/web", searchRouter);
app.use("/api/admin", forgetRouter);
app.use("/api/web/reviews", reviewRouter);
app.use("/api/auth/reviews", reviewRouter);
app.use("/api/auth/borrow", BorrowRouter);
app.use("/api/admin", borrowtreRouter);

// ---------------------
// 🛠 Test & Error Handling
// ---------------------
app.get("/", (req, res) => {
  res.send("Backend working fine ✅");
});

// CORS errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
    });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ---------------------
// 🔗 DB Connect + Server Start
// ---------------------
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

connectDB();
