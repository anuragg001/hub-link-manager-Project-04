import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to silently refresh token on boot if one exists
    axiosClient.post('/auth/refresh')
      .then(() => {
        // Here we'd ideally fetch /me to get user details
        // Mocking for now since there's no /me auth endpoint in the spec aside from bio
        setUser({ id: 'active' }); 
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    setUser(res.data.user);
  };

  const signup = async (username, email, password) => {
    const res = await axiosClient.post('/auth/signup', { username, email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axiosClient.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};