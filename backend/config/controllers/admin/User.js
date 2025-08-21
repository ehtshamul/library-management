const { User } = require("../../models/admin/User");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh,
  hashToken,
  compareToken,
} = require("../../utils/token");
const crypto = require("crypto");

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth/refresh",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  domain: process.env.COOKIE_DOMAIN || undefined,
};

function extractClient(req) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress,
  };
}

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // generate tokens
    const tokenId = crypto.randomUUID();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, tokenId);

    // store hashed refresh token
    const { userAgent, ip } = extractClient(req);
    user.refreshTokens.push({
      tokenHash: await hashToken(refreshToken),
      userAgent,
      ip,
    });
    await user.save();

    // set cookie
    res.cookie("rt", refreshToken, cookieOpts);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// REFRESH
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token" });

    const payload = verifyRefresh(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    // check token validity
    const matchIndex = await (async () => {
      for (let i = 0; i < user.refreshTokens.length; i++) {
        if (await compareToken(token, user.refreshTokens[i].tokenHash)) return i;
      }
      return -1;
    })();

    if (matchIndex === -1) {
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ success: false, message: "Refresh token invalidated" });
    }

    // rotate refresh token
    user.refreshTokens.splice(matchIndex, 1);

    const newTokenId = crypto.randomUUID();
    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user, newTokenId);

    const { userAgent, ip } = extractClient(req);
    user.refreshTokens.push({
      tokenHash: await hashToken(newRefreshToken),
      userAgent,
      ip,
    });
    await user.save();

    res.cookie("rt", newRefreshToken, cookieOpts);
    return res.json({ success: true, accessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(401).json({ success: false, message: "Invalid/expired refresh token" });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    res.clearCookie("rt", { ...cookieOpts, maxAge: 0 });

    if (!token) return res.json({ success: true, message: "Logged out" });

    try {
      const payload = verifyRefresh(token);
      const user = await User.findById(payload.sub);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(async (rt) => 
          !(await compareToken(token, rt.tokenHash))
        );
        await user.save();
      }
    } catch (err) {
      console.error("Logout token verification error:", err);
    }

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout error", error: err.message });
  }
};

module.exports = { signup, login, refresh, logout };