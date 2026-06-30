"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "@phosphor-icons/react";
import type { ProductListItem } from "@/lib/api";

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
      <div className="double-bezel transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/5">
        <div className="double-bezel-inner bg-card">
          <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Star className="size-10 text-white/[0.06]" weight="light" />
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
        <Star
          key={i}
          className={`size-3.5 ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-white/[0.03] text-white/[0.08]"
          }`}
          weight={i < Math.round(rating) ? "fill" : "regular"}
        />
      ))}
    </div>
  );
}
