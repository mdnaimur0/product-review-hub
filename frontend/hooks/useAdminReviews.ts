"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  adminAdminDeleteReview,
  adminAdminListReviews,
  type AdminReviewRead,
} from "@/lib/api";

export function useAdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewRead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      try {
        const { data, error } = await adminAdminListReviews();
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
  }, []);

  const fetchReviews = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        const { data, error } = await adminAdminListReviews();
        if (error) throw error;
        setReviews(data ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      }
    });
  }, []);

  const deleteReview = useCallback(
    async (reviewId: number) => {
      try {
        const { error } = await adminAdminDeleteReview({
          path: { review_id: reviewId },
        });
        if (error) throw error;
        fetchReviews();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Failed to delete review",
        };
      }
    },
    [fetchReviews],
  );

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchReviews,
    deleteReview,
  };
}
