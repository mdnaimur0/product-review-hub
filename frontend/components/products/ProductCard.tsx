"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { ProductListItem } from "@/lib/api";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block animate-fade-up"
    >
      <div className="double-bezel transition-smooth duration-500 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/5">
        <div className="double-bezel-inner bg-card">
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover transition-smooth duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground/30">
                <Star className="size-12" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="mb-2 line-clamp-1 text-base font-semibold text-foreground">
              {product.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={product.average_rating} />
                <span className="text-sm font-medium text-foreground">
                  {product.average_rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {product.review_count}{" "}
                {product.review_count === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 stroke-amber-400 stroke-1 ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted/50 text-muted/50"
          }`}
        />
      ))}
    </div>
  );
}
