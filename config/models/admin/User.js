const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
// User schema definition

const refreshToken= new Schema({
  hash:{type:String,required:true},
  userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
  createdAt:{type:Date,default:Date.now,expires:"7d"},
  userAgent:{type:String,required:true},
  ipAddress:{type:String,required:true},

},{_id:true});


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);
const RefreshToken = mongoose.model("RefreshToken", refreshToken);

module.exports = { User, RefreshToken };

