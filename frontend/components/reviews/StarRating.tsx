"use client";

import { useState } from "react";
import { StarIcon as Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "size-4", md: "size-5", lg: "size-7" };

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => !readonly && setHover(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const rating = i + 1;
        const filled = rating <= (hover || value);

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-all duration-500 ease-out-expo",
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95",
            )}
            onMouseEnter={() => !readonly && setHover(rating)}
            onClick={() => !readonly && onChange?.(rating)}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-(--bg-subtle) text-(--border-subtle)",
                "stroke-2 stroke-foreground",
              )}
              weight={filled ? "fill" : "regular"}
            />
          </button>
        );
      })}
    </div>
  );
}
