const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ;
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables!");
}

function signAccess(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function signRefresh(user, tokenId) {
  return jwt.sign(
    { sub: user._id.toString(), jwt: tokenId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

function verifyAccess(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function verifyRefresh(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}

async function hash(token) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

async function compare(token, hashValue) {
  return bcrypt.compare(token, hashValue);
}

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  hash,
  compare
};
