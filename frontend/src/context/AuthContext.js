import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (email, password, navigate) => {
    try {
      await axios.post('http://localhost:5000/register', { email, password });
      navigate('/login');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });

      if (response.data.token) {
        const user = { email, token: response.data.token };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
