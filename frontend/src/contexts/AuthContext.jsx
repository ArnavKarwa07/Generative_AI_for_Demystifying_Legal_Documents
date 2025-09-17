import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

// Demo users for prototype
const DEMO_USERS = [
  {
    id: 1,
    name: "John Smith",
    email: "demo@clausecraft.com",
    password: "demo123",
    role: "admin",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "lawyer@clausecraft.com",
    password: "lawyer123",
    role: "lawyer",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "client@clausecraft.com",
    password: "client123",
    role: "client",
  },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const isDemoMode = localStorage.getItem("demoMode") === "true";
    setDemoMode(isDemoMode);

    if (isDemoMode) {
      const demoUser = localStorage.getItem("demoUser");
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      }
      setLoading(false);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        checkAuth();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // First try demo mode
      const demoUser = DEMO_USERS.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (demoUser) {
        const { password, ...userWithoutPassword } = demoUser;
        setUser(userWithoutPassword);
        setDemoMode(true);
        localStorage.setItem("demoMode", "true");
        localStorage.setItem("demoUser", JSON.stringify(userWithoutPassword));
        return { success: true };
      }

      // If not demo, try API
      const response = await authAPI.login(credentials);
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      setDemoMode(false);
      localStorage.setItem("demoMode", "false");
      await checkAuth();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Login failed. Try demo credentials: demo@clausecraft.com / demo123",
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Registration failed - API not available",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("demoMode");
    localStorage.removeItem("demoUser");
    setUser(null);
    setDemoMode(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    demoMode,
    demoUsers: DEMO_USERS.map(({ password, ...user }) => user), // Return users without passwords for display
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
