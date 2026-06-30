"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { productsGetProduct, type ProductDetail } from "@/lib/api";

interface UseProductReturn {
  product: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
}

export function useProduct(productId: number): UseProductReturn {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const fetchProduct = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        setNotFound(false);
        const { data, error, response } = await productsGetProduct({
          path: { product_id: productId },
        });
        if (error) {
          if (response?.status === 404) {
            setNotFound(true);
            setError(null);
            return;
          }
          throw error;
        }
        setProduct(data ?? null);
        setError(null);
        setNotFound(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      }
    });
  }, [productId]);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, fetchProduct]);

  return { product, isLoading, error, notFound, refetch: fetchProduct };
}
