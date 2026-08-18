import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await authAPI.me();
          setUser(response.data);
        } catch (error) {
          console.error("Auth fetch failed:", error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    return response;
  };

  const logout = () => {
    try {
        authAPI.logout();
    } catch(e) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
