"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { productsListProducts, type ProductListItem } from "@/lib/api";

export function useProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchProducts = useCallback(() => {
    startTransition(async () => {
      try {
        const { data, error } = await productsListProducts();
        if (error) throw error;
        setProducts(data ?? []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      }
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}
