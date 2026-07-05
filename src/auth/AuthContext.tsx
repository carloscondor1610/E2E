import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../api/auth.api';
import { TOKEN_KEY } from '../api/http';
import type { User } from '../types/user.types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  saveTokenAndLoadUser: (token: string) => Promise<User>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const saveTokenAndLoadUser = useCallback(async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      setIsLoading(true);
      const currentUser = await refreshUser();

      if (!ignore) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      ignore = true;
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      saveTokenAndLoadUser,
      refreshUser,
      logout,
    }),
    [user, isLoading, saveTokenAndLoadUser, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
