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

// Cookie options for refresh token
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax", // 'none' if cross-site, must use secure
  secure: process.env.NODE_ENV === "production",
  path: "/", // send cookie to all routes
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper to get client info
function extractClient(req) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress,
  };
}

// ------------------ SIGNUP ------------------
const signup = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role)
    return res.status(400).json({ success: false, message: "All fields are required" });

  if (password !== confirmPassword)
    return res.status(400).json({ success: false, message: "Passwords do not match" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email & password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const tokenId = crypto.randomUUID();
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user, tokenId);

    // Save hashed refresh token
    const { userAgent, ip } = extractClient(req);
    await RefreshToken.create({
      hash: await hash(refreshToken),
      userId: user._id,
      userAgent,
      ipAddress: ip,
    });

    // Send refresh token cookie
    res.cookie("rt", refreshToken, cookieOpts);

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ REFRESH TOKEN ------------------
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefresh(token);
    if (!payload) return res.status(401).json({ message: "Invalid refresh token" });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Find all refresh tokens for user and compare
    const tokens = await RefreshToken.find({ userId: user._id });
    const match = await Promise.all(tokens.map(async t => (await compare(token, t.hash)) ? t : null));
    const storedToken = match.find(t => t !== null);

    if (!storedToken) {
      await RefreshToken.deleteMany({ userId: user._id }); // invalidate all
      return res.status(401).json({ message: "Refresh token invalidated" });
    }

    // Rotate token
    await RefreshToken.deleteOne({ _id: storedToken._id });
    const newTokenId = crypto.randomUUID();
    const newAccessToken = signAccess(user);
    const newRefreshToken = signRefresh(user, newTokenId);

    const { userAgent, ip } = extractClient(req);
    await RefreshToken.create({
      hash: await hash(newRefreshToken),
      userId: user._id,
      userAgent,
      ipAddress: ip,
    });

    res.cookie("rt", newRefreshToken, cookieOpts);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Refresh failed" });
  }
};

// ------------------ LOGOUT ------------------
const logout = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });

    if (token) {
      const payload = verifyRefresh(token);
      if (payload) {
        const tokens = await RefreshToken.find({ userId: payload.sub });
        for (const t of tokens) {
          if (await compare(token, t.hash)) await RefreshToken.deleteOne({ _id: t._id });
        }
      }
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout error" });
  }
};

module.exports = { signup, login, refresh, logout };
