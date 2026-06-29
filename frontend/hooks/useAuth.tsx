"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usersUsersCurrentUser, type UserRead } from "@/lib/api";

interface AuthContextValue {
  user: UserRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [, startTransition] = useTransition();
  const [fetched, setFetched] = useState(false);

  const fetchUser = useCallback(() => {
    startTransition(async () => {
      try {
        const { data } = await usersUsersCurrentUser();
        setUser(data ?? null);
      } catch {
        setUser(null);
      } finally {
        setFetched(true);
      }
    });
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: !fetched,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
