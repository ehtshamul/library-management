const { User, RefreshToken } = require("../../models/admin/User");
const crypto = require("crypto");
const {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  hash,
  compare,
} = require("../../utils/Token");


const cookieOpts = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: false, 
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper to get client info
function extractClient(req) {
  return {
    userAgent: req.headers["user-agent"] || "unknown",
    ip:
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown",
  };
}

async function persistRefreshToken(token, userId, client) {
  try {
    const tokenHash = await hash(token);
    const refreshToken = await RefreshToken.create({
      hash: tokenHash,
      userId,
      userAgent: client.userAgent,
      ipAddress: client.ip,
    });
    console.log("âœ… Refresh token saved to MongoDB:", refreshToken._id);
    return refreshToken;
  } catch (error) {
    console.error("âŒ Failed to save refresh token:", error);
    throw error;
  }
}

// ------------------ SIGNUP ------------------
const signup = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      user: { id: user._id, user, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  console.log("🔐 Login attempt:", { email: req.body.email, hasPassword: !!req.body.password });
  console.log("📝 Request body:", req.body);
  console.log("🔑 Headers:", req.headers);

  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email & password required" });

  try {
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user || !(await user.comparePassword(password))) {
      console.log("❌ Authentication failed");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const tokenId = crypto.randomUUID();
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user, tokenId);

    const client = extractClient(req);

    // Persist refresh token first. If persist fails, do not set cookie or return tokens.
    let saved;
    try {
      saved = await persistRefreshToken(refreshToken, user._id, client);
      console.log("âœ… Refresh token persisted successfully for user:", user._id);
    } catch (err) {
      console.error("Failed to persist refresh token on login:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to persist refresh token" });
    }

    // Send refresh token cookie
    res.cookie("rt", refreshToken, cookieOpts);

    res.json({
      success: true,
      accessToken,
      refreshToken, // included for API clients
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ REFRESH TOKEN ------------------
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.rt || req.body?.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    const payload = verifyRefresh(token);
    if (!payload) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Fetch all stored tokens for user and locate matching hash
    const tokens = await RefreshToken.find({ userId: user._id });
    if (!tokens || tokens.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh tokens found" });
    }

    let storedToken = null;
    for (const t of tokens) {
      if (await compare(token, t.hash)) {
        storedToken = t;
        break;
      }
    }

    if (!storedToken) {
      // Potential token reuse/compromise: remove all tokens for user and clear cookie
      await RefreshToken.deleteMany({ userId: user._id });
      console.log("⚠️ Potential token reuse detected, all tokens removed for user:", user._id);
      // Clear cookie on client
      res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });
      return res
        .status(401)
        .json({ success: false, message: "Refresh token invalidated" });
    }

    // Rotate token: persist new token first, then remove old one.
    const newTokenId = crypto.randomUUID();
    const newAccessToken = signAccess(user);
    const newRefreshToken = signRefresh(user, newTokenId);
    const client = extractClient(req);

    let newSaved;
    try {
      newSaved = await persistRefreshToken(newRefreshToken, user._id, client);
      console.log("âœ… New refresh token persisted during rotation");
    } catch (err) {
      console.error("Failed to persist new refresh token during rotation:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to rotate refresh token" });
    }

    // Remove the old token after new one persisted
    try {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      console.log("âœ… Old refresh token removed");
    } catch (err) {
      // Log but continue â€” old token removal failure shouldn't block issuance
      console.error("Failed to delete old refresh token:", err);
    }

    // Set new refresh token cookie
    res.cookie("rt", newRefreshToken, cookieOpts);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });
    res.status(401).json({ success: false, message: "Refresh failed" });
  }
};

// ------------------ LOGOUT ------------------
const logout = async (req, res) => {
  try {
    const token = req.cookies?.rt || req.body?.refreshToken;

    if (token) {
      const payload = verifyRefresh(token);
      if (payload) {
        const deletedCount = await RefreshToken.deleteMany({ userId: payload.sub });
        console.log(`âœ… Deleted ${deletedCount.deletedCount} refresh tokens for user:`, payload.sub);
      }
    }

    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });
    res.status(500).json({ success: false, message: "Logout error" });
  }
};

module.exports = { signup, login, refresh, logout };