// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard, login as apiLogin, logout as apiLogout } from "../server/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize from localStorage and optionally validate for admins
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        try {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Optionally validate for admin users only (dashboard requires admin)
          const role = JSON.parse(storedUser || '{}')?.role;
          if (role && String(role).toLowerCase() === "admin") {
            await Dashboard();
          }
        } catch (error) {
          // If validation fails, clear token but don't crash app
          console.error("Auth validation failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { accessToken, user: userData } = response.data || {};

      if (accessToken && userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          role: userData.role,
          email: userData.email,
        });
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        if (String(userData.role).toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }

        return { success: true };
      }

      return { success: false, message: "Invalid response from server" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

