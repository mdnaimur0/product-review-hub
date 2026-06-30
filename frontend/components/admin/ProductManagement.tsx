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
import { Spinner } from "@/components/ui/spinner";
import { Trash, Plus, Package } from "@phosphor-icons/react";
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
      <div className="double-bezel">
        <div className="double-bezel-inner bg-card p-6">
          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Manage Products
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="skeleton-shimmer size-10 rounded-lg" />
                  <div className="space-y-2">
                    <div className="skeleton-shimmer h-4 w-32 rounded" />
                    <div className="skeleton-shimmer h-3 w-20 rounded" />
                  </div>
                </div>
                <div className="skeleton-shimmer size-7 rounded" />
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
        <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Manage Products
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground/60">
              {products.length} products
            </span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default" className="gap-2">
                  <Plus className="size-3.5" weight="bold" />
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06]">
              <Package
                className="size-6 text-muted-foreground/40"
                weight="light"
              />
            </div>
            <p className="text-sm text-muted-foreground/60">
              No products found
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] p-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.03] size-12 min-w-12 ring-1 ring-white/[0.06]">
                    {product.image_url ? (
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="size-full object-cover"
                        />
                      </Link>
                    ) : (
                      <Package
                        className="size-5 text-muted-foreground/40"
                        weight="light"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm font-medium text-foreground"
                    >
                      {product.title}
                    </Link>
                    {product.description && (
                      <p className="text-xs text-muted-foreground/60 line-clamp-2 md:line-clamp-1">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/40">
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
                    <Spinner />
                  ) : (
                    <Trash className="size-3" weight="bold" />
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
