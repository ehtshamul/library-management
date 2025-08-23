// Auth middleware (protect routes)
const { verifyAccess } = require("../utils/Token");

function auth(requiredRoles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers['authorization'] || "";
      if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
      }

      const token = header.split(" ")[1]; // get token part
      if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
      }

      const payload = verifyAccess(token);
      req.user = { id: payload.sub, role: payload.role || "User" };

      // role check
      if (requiredRoles.length && !requiredRoles.some(r => req.user.role === r)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Token is not valid" });
    }
  };
}

module.exports = { auth };
