"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  adminAdminCreateProduct,
  adminAdminDeleteProduct,
  adminAdminListProducts,
  type ProductRead,
  type ProductCreate,
} from "@/lib/api";

export function useAdminProducts() {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchProducts = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        const { data, error } = await adminAdminListProducts();
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

  const createProduct = useCallback(
    async (productData: ProductCreate) => {
      try {
        const { error } = await adminAdminCreateProduct({ body: productData });
        if (error) throw error;
        fetchProducts();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "Failed to create product",
        };
      }
    },
    [fetchProducts],
  );

  const deleteProduct = useCallback(
    async (productId: number) => {
      try {
        const { error } = await adminAdminDeleteProduct({
          path: { product_id: productId },
        });
        if (error) throw error;
        fetchProducts();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "Failed to delete product",
        };
      }
    },
    [fetchProducts],
  );

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    createProduct,
    deleteProduct,
  };
}
