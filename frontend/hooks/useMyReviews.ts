"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { reviewsGetMyReviews, type ReviewRead } from "@/lib/api";

export function useMyReviews() {
  const [reviews, setReviews] = useState<ReviewRead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchReviews = useCallback(() => {
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

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, isLoading, error, refetch: fetchReviews };
}
