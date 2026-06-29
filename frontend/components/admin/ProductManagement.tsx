"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Package } from "lucide-react";
import Image from "next/image";
import type { ProductListItem } from "@/lib/api";

interface ProductManagementProps {
  products: ProductListItem[];
  isLoading: boolean;
  onDelete: (productId: number) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export function ProductManagement({
  products,
  isLoading,
  onDelete,
}: ProductManagementProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);
    setError(null);

    const result = await onDelete(productId);

    if (!result.success) {
      setError(result.error || "Failed to delete product");
    }

    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="double-bezel">
        <div className="double-bezel-inner bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Manage Products
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 animate-pulse rounded-lg bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="size-7 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="double-bezel">
      <div className="double-bezel-inner bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Manage Products
          </h3>
          <span className="text-sm text-muted-foreground">
            {products.length} products
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-smooth duration-200 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package className="size-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.review_count} reviews
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  aria-label={`Delete ${product.title}`}
                >
                  {deletingId === product.id ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
