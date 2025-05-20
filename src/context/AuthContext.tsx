
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { currentUser } from '../data/mockData';

interface AuthContextProps {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(currentUser); // Start with the mock user

  const login = (userId: string) => {
    // In a real application, this would involve an API call
    // For now, we're using the mock user
    setUser(currentUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
