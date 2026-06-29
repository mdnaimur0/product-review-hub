"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import type { ProductCreate } from "@/lib/api";
import { toast } from "sonner";

interface AddProductFormProps {
  onSubmit: (data: ProductCreate) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export function AddProductForm({ onSubmit }: AddProductFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    startTransition(async () => {
      const result = await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });

      if (result.success) {
        setTitle("");
        setDescription("");
        setImageUrl("");
        toast.success("Product created successfully!");
      } else {
        toast.error(result.error || "Failed to create product");
      }
    });
  };

  return (
    <div className="double-bezel h-min">
      <div className="double-bezel-inner bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Add New Product
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-title">Title *</Label>
            <Input
              id="product-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">Description</Label>
            <textarea
              id="product-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              disabled={isPending}
              className="w-full resize-none rounded-md border border-input bg-input/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-smooth duration-200 focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Image URL</Label>
            <Input
              id="product-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}
            {isPending ? "Creating..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
