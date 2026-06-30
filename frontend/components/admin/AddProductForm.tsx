"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { ProductCreate } from "@/lib/api";
import { toast } from "sonner";

interface AddProductFormProps {
  onSubmit: (data: ProductCreate) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onSuccess: () => void;
}

export function AddProductForm({ onSubmit, onSuccess }: AddProductFormProps) {
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
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create product");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-ring/50 focus:ring-3 focus:ring-ring/20 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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

      <Button type="submit" disabled={isPending} className="w-full gap-2">
        {isPending ? <Spinner /> : null}
        {isPending ? "Creating..." : "Add Product"}
      </Button>
    </form>
  );
}
