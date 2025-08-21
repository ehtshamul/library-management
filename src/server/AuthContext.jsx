// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard, login as apiLogin, logout as apiLogout } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load token from localStorage on mount and validate it
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          // Verify token is still valid by making an API call
          const response = await Dashboard();
          if (response.data.user) {
            setUser({ 
              id: response.data.user.id, 
              name: response.data.user.name, 
              role: response.data.user.role 
            });
            setToken(storedToken);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (loginData) => {
    try {
      const response = await apiLogin(loginData);
      const { accessToken, user: userData } = response.data;
      
      if (accessToken && userData) {
        setUser({ 
          id: userData.id, 
          name: userData.name, 
          role: userData.role 
        });
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        
        // Redirect based on role
        if (userData.role.toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
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
      navigate("/login");
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
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