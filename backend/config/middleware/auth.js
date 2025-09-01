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
      if (!payload) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      // normalize role to a consistent format (string) and default to 'User'
      const role = (payload.role || payload.Role || payload.Roles || "User");
      req.user = { id: payload.sub, role };

      // role check (case-insensitive). If requiredRoles is empty, skip check.
      if (requiredRoles && requiredRoles.length) {
        const requiredLower = requiredRoles.map(r => String(r).toLowerCase());
        if (!requiredLower.includes(String(req.user.role).toLowerCase())) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Token is not valid" });
    }
  };
}

module.exports = { auth };
