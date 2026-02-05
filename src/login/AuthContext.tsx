import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../shared/api/client';
import { AuthState, User, AuthResponse } from '../shared/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (state.token && storedUser) {
        try {
            setState(prev => ({ ...prev, user: JSON.parse(storedUser), isLoading: false }));
        } catch (e) {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    } else {
        setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await client.post<AuthResponse>('/auth/login', { email, password });
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setState({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
        // Extract error message from axios error response if available
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed';
        throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await client.post<AuthResponse>('/auth/register', { name, email, password });
      // Don't auto-login, just return success
      if (response.data.error) {
          throw new Error(response.data.error);
      }
    } catch (error: any) {
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
