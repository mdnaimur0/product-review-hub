"use client";

import {
  productsListProducts,
  type PaginatedProductList,
  type ProductListItem,
} from "@/lib/api";
import debounce from "lodash/debounce";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

export interface ProductFilters {
  search?: string | null;
  min_rating?: number | null;
  max_rating?: number | null;
  page?: number;
  page_size?: number;
}

interface UseProductsReturn {
  products: ProductListItem[];
  pagination: Omit<PaginatedProductList, "items">;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(filters?: ProductFilters): UseProductsReturn {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [pagination, setPagination] = useState<
    Omit<PaginatedProductList, "items">
  >({ total: 0, page: 1, page_size: 12, total_pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const fetchProducts = useCallback(() => {
    startTransition(async () => {
      try {
        const { data, error } = await productsListProducts({
          query: {
            search: filters?.search ?? undefined,
            min_rating: filters?.min_rating ?? undefined,
            max_rating: filters?.max_rating ?? undefined,
            page: filters?.page ?? 1,
            page_size: filters?.page_size ?? 12,
          },
        });
        if (error) throw error;
        if (!data) throw new Error("No data received");
        setProducts(data.items);
        setPagination({
          total: data.total,
          page: data.page,
          page_size: data.page_size,
          total_pages: data.total_pages,
        });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      }
    });
  }, [filters]);

  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 500),
    [fetchProducts],
  );

  useEffect(() => {
    debouncedFetchProducts();

    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [debouncedFetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: debouncedFetchProducts,
  };
}
