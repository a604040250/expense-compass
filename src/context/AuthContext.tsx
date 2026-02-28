import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/utils/types';
import { getFromStorage, setToStorage, generateId } from '@/utils/helpers';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getFromStorage('currentUser', null));

  useEffect(() => {
    if (user) setToStorage('currentUser', user);
    else localStorage.removeItem('currentUser');
  }, [user]);

  const login = useCallback((email: string, password: string): boolean => {
    const users: User[] = getFromStorage('users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return true; }
    return false;
  }, []);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    const users: User[] = getFromStorage('users', []);
    if (users.some(u => u.email === email)) return false;
    const newUser: User = { id: generateId(), name, email, password };
    setToStorage('users', [...users, newUser]);
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
