"use client";

import type { ProductListItem } from "@/lib/api";
import { StarIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      style={{ animation: "fade-up-blur 0.9s var(--ease-out-expo) both" }}
    >
      <div className="double-bezel transition-all duration-700 ease-out-expo group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/5">
        <div className="double-bezel-inner bg-card">
          <div className="relative aspect-4/3 overflow-hidden bg-(--bg-subtle)">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover transition-all duration-700 ease-out-expo group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <StarIcon
                  className="size-10 text-(--bg-muted)"
                  weight="light"
                />
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="mb-2 line-clamp-1 text-base font-semibold text-foreground">
              {product.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground/70 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RatingStars rating={product.average_rating} />
                <span className="text-sm font-medium text-foreground/80">
                  {product.average_rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground/50">
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
        <StarIcon
          key={i}
          className={`size-3.5 stroke-2 stroke-foreground ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-(--bg-subtle) text-(--border-subtle)"
          }`}
          weight={i < Math.round(rating) ? "fill" : "regular"}
        />
      ))}
    </div>
  );
}
