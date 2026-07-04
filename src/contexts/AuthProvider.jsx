import { useState, useEffect, useCallback } from "react";
import { authService } from "../api/auth";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No user/token in localStorage anymore — the only source of truth is
    // the httpOnly refresh cookie, so we ask the backend on every app load.
    const bootstrap = async () => {
      try {
        const userData = await authService.refresh();
        setUser({ ...userData, isAdmin: userData.role === "ADMIN" });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = useCallback(async (email, password) => {
    const userData = await authService.login(email, password);
    const userWithRole = { ...userData, isAdmin: userData.role === "ADMIN" };
    setUser(userWithRole);
    return userWithRole;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
