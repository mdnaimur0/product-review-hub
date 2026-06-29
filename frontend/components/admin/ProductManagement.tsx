"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2, Package, Plus } from "lucide-react";
import Image from "next/image";
import type { ProductRead, ProductCreate } from "@/lib/api";
import { toast } from "sonner";
import { AddProductForm } from "./AddProductForm";
import Link from "next/link";

interface ProductManagementProps {
  products: ProductRead[];
  isLoading: boolean;
  onDelete: (productId: number) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onCreate: (data: ProductCreate) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export function ProductManagement({
  products,
  isLoading,
  onDelete,
  onCreate,
}: ProductManagementProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async (productId: number) => {
    setDeletingId(productId);

    const result = await onDelete(productId);

    if (result.success) {
      toast.success("Product deleted successfully!");
    } else {
      toast.error(result.error || "Failed to delete product");
    }

    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="double-bezel h-min">
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
        <div className="mb-4 flex items-center justify-between flex-wrap">
          <h3 className="text-lg font-semibold text-foreground">
            Manage Products
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {products.length} products
            </span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default" className="gap-1.5">
                  <Plus className="size-3.5" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new product.
                  </DialogDescription>
                </DialogHeader>
                <AddProductForm
                  onSubmit={onCreate}
                  onSuccess={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-smooth duration-200 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted size-12 min-w-12">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package className="size-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-foreground">
                      {product.title}
                    </p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 md:line-clamp-1">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60">
                      Added {new Date(product.created_at).toLocaleDateString()}
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
