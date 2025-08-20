// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; // make sure it's installed: npm install jwt-decode

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, role }
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwt_decode(storedToken);
        setUser({ name: decoded.name, role: decoded.role.toLowerCase() });
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token in localStorage:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (jwtToken) => {
    try {
      const decoded = jwt_decode(jwtToken);
      const userData = { name: decoded.name, role: decoded.role.toLowerCase() };
      setUser(userData); // ✅ triggers Nav re-render
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
      navigate("/dashboard"); // optional redirect
    } catch (err) {
      console.error("Invalid JWT token:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
