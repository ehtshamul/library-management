const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');
const errorHandler = require("./config/middleware/errorHandler");
const cookieParser = require("cookie-parser");

// Load environment variables first
dotenv.config();

// Get the current directory path
const currentDir = path.resolve();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(currentDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Import routes
const userRouter = require("./config/routes/admin/User");
const dashboardRouter = require("./config/routes/admin/Dashboard");
const booksRouter = require("./config/routes/admin/books");
const getBooksRouter = require("./config/routes/web/getbooks");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

function startServer() {
  // Check for required environment variables
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error("❌ FATAL ERROR: JWT_SECRET or JWT_REFRESH_SECRET is not defined");
    process.exit(1);
  }

  // Connect to database then start server
  connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  });
}

// Routes
app.use("/api/auth", userRouter);
app.use("/api/auth", dashboardRouter);
app.use("/api/auth", booksRouter);
app.use("/api/web", getBooksRouter);

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend working fine ✅");
});

// Error handler (must be last middleware)
app.use(errorHandler);

// Only start server when run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, connectDB };