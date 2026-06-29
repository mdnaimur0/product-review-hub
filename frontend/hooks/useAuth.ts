"use client";

import { useEffect, useState, useTransition } from "react";
import { usersUsersCurrentUser, type UserRead } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      try {
        const { data } = await usersUsersCurrentUser();
        if (!cancelled) setUser(data ?? null);
      } catch {
        if (!cancelled) setUser(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}
