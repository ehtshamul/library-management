const { User, RefreshToken } = require("../../models/admin/User");
const crypto = require("crypto");
const {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  hash,
  compare
} = require("../../utils/Token");

// Cookie options
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth/refresh",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  domain: process.env.COOKIE_DOMAIN || undefined
};

// Helper to get client info
function extractClient(req) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress
  };
}

// ------------------ SIGNUP ------------------
const signup = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  try {
    if (!name || !email || !password || !confirmPassword || !role)
      return res.status(400).json({ success: false, message: "Please fill all fields" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please enter email and password" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const tokenId = crypto.randomUUID();
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user, tokenId);

    // Store hashed refresh token in DB
    const { userAgent, ip } = extractClient(req);
    await RefreshToken.create({
      hash: await hash(refreshToken),
      userId: user._id,
      jti: tokenId,
      userAgent,
      ipAddress: ip
    });

    // Send refresh token as httpOnly cookie
    res.cookie("rt", refreshToken, cookieOpts);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------ REFRESH TOKEN ------------------
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefresh(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    let storedToken = await RefreshToken.findOne({ userId: user._id, jti: payload.jti });
    // Fallback for legacy tokens without jti stored in DB
    if (!storedToken) {
      storedToken = await RefreshToken.findOne({ userId: user._id }).sort({ createdAt: -1 });
    }
    if (!storedToken || !(await compare(token, storedToken.hash))) {
      await RefreshToken.deleteMany({ userId: user._id }); // invalidate all
      return res.status(401).json({ message: "Refresh token invalidated" });
    }

    // Rotate token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    const tokenId = crypto.randomUUID();
    const newAccessToken = signAccess(user);
    const newRefreshToken = signRefresh(user, tokenId);

    const { userAgent, ip } = extractClient(req);
    await RefreshToken.create({
      hash: await hash(newRefreshToken),
      userId: user._id,
      jti: tokenId,
      userAgent,
      ipAddress: ip
    });

    res.cookie("rt", newRefreshToken, cookieOpts);
    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Invalid/expired refresh token" });
  }
};

// ------------------ LOGOUT ------------------
const logout = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });

    if (token) {
      try {
        const payload = verifyRefresh(token);
        // delete only this session's token by userId + jti
        await RefreshToken.deleteOne({ userId: payload.sub, jti: payload.jti });
      } catch { /* ignore errors */ }
    }

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error", error: error.message });
  }
};

module.exports = { signup, login, refresh, logout };
