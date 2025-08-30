const express = require("express");
const app = express();
// Use Express built-in body parsers
const Jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');
const cookieParser = require("cookie-parser");


app.use(cookieParser());


// Import routes
const userRouter = require("./config/routes/admin/User");
const dashboardRouter = require("./config/routes/admin/Dashboard");
const booksRouter = require("./config/routes/admin/books");
const getBooksRouter = require("./config/routes/web/getbooks");
const searchRouter = require("./config/routes/web/search");
const reviewRouter= require("./config/routes/web/Review");
const review = require("./config/models/admin/review");

dotenv.config();

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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
// app.use(cors({
//   origin: "*", // allow any origin
//   credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
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
// for add review 
app.use("/api/web", reviewRouter);
// for delect review  own
app.use("/api/web", reviewRouter);
// for approved review by admin
app.use("/api/auth", reviewRouter);
// show review on books
app.use("/api/web", reviewRouter);


// Simple test route
app.get("/", (req, res) => {
  res.send("Backend working fine ✅");
});