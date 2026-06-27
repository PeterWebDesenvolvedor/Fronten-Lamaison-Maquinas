import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            isAdmin: userData.role === 'ADMIN'
          });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      const { accessToken, refreshToken, user: userData } = response;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      const userWithRole = {
        ...userData,
        isAdmin: userData.role === 'ADMIN'
      };

      setUser(userWithRole);
      return userWithRole;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};