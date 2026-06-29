"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  adminAdminDeleteReview,
  productsListProducts,
  productsGetProduct,
  type ReviewRead,
} from "@/lib/api";

interface ReviewWithProduct extends ReviewRead {
  productTitle?: string;
}

export function useAdminReviews() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchAllReviews = useCallback(async () => {
    startTransition(async () => {
      try {
        const { data: products, error: productsError } =
          await productsListProducts();
        if (productsError) throw productsError;

        if (!products || products.length === 0) {
          setReviews([]);
          return;
        }

        const allReviews: ReviewWithProduct[] = [];

        for (const product of products) {
          const { data: productDetail, error: productError } =
            await productsGetProduct({
              path: { product_id: product.id },
            });

          if (!productError && productDetail?.reviews) {
            for (const review of productDetail.reviews) {
              allReviews.push({
                ...review,
                productTitle: productDetail.title,
              });
            }
          }
        }

        setReviews(allReviews);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      }
    });
  }, []);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const deleteReview = useCallback(
    async (reviewId: number) => {
      try {
        const { error } = await adminAdminDeleteReview({
          path: { review_id: reviewId },
        });
        if (error) throw error;
        fetchAllReviews();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Failed to delete review",
        };
      }
    },
    [fetchAllReviews],
  );

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchAllReviews,
    deleteReview,
  };
}
