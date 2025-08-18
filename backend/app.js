const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userrouter= require("./config/routes/admin/User");

dotenv.config();
app.use(cors());
app.use(bodyParser.json()); // so you can read req.body

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit the process with failure
  }
};

// call the function
connectDB();
//
// Routers 
app.use("/api/auth",userrouter);
app.use("/api/auth",userrouter);

// simple test route
app.get("/", (req, res) => {
  res.send("Backend working fine ✅");
});
