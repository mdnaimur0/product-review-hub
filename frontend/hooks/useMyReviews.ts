"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { reviewsGetMyReviews, type ReviewRead } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useMyReviews() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<ReviewRead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    startTransition(async () => {
      try {
        const { data, error } = await reviewsGetMyReviews();
        if (cancelled) return;
        if (error) throw error;
        setReviews(data ?? []);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load reviews",
          );
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const fetchReviews = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        const { data, error } = await reviewsGetMyReviews();
        if (error) throw error;
        setReviews(data ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      }
    });
  }, []);

  return {
    reviews,
    isLoading: isLoading || authLoading,
    error,
    refetch: fetchReviews,
  };
}
