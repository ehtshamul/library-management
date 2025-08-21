const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_ACCESS_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES }
  );
}

function signRefreshToken(user, tokenId) {
  return jwt.sign(
    { sub: user._id.toString(), tid: tokenId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES }
  );
}

function verifyAccess(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

function verifyRefresh(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

async function hashToken(token) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

async function compareToken(token, tokenHash) {
  return bcrypt.compare(token, tokenHash);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
  hashToken,
  compareToken,
};