import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            isAdmin: userData.role === "ADMIN",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, navigate }}>
      {children}
    </AuthContext.Provider>
  );
}
