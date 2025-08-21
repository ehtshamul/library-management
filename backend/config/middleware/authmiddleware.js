const { verifyAccess } = require('../utils/token');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "No access token" });

      const payload = verifyAccess(token);
      req.user = { id: payload.sub, role: payload.role };

      // role check
      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ message: "Invalid/expired access token" });
    }
  };
}

module.exports = { auth };