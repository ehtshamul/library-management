// middleware/authMiddleware.js
const authMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith("/rejected")) {
    const error = action.payload?.message || "";
    if (error.includes("Unauthorized") || error.includes("Token expired")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // 🔁 redirect to login
    }
  }
  return next(action);
};

export default authMiddleware;
