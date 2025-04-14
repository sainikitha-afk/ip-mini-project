import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email, token });
    }
  }, []);

  const register = async (email, password, navigate) => {
    try {
      await axios.post('http://localhost:5000/register', { email, password });
      navigate('/login'); // Redirect to login after successful registration
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Registration failed' };
    }
  };
  
  
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
  
      if (response.data.token) {
        setUser({ email, token: response.data.token }); // store both
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", email);
        return { success: true };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.error || "Login failed" };
    }
  };
  

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);