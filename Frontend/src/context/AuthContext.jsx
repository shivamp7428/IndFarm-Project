import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = res.data.user || res.data;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.removeItem("token"); 
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = () => fetchUser();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};