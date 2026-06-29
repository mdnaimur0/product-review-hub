"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { productsGetProduct, type ProductDetail } from "@/lib/api";

export function useProduct(productId: number) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchProduct = useCallback(() => {
    startTransition(async () => {
      try {
        const { data, error } = await productsGetProduct({
          path: { product_id: productId },
        });
        if (error) throw error;
        setProduct(data ?? null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      }
    });
  }, [productId]);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
}
