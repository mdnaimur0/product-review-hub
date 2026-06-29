"use client";

import { useState } from "react";
import { Star } from "lucide-react";
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
    <div className="flex gap-0.5" onMouseLeave={() => !readonly && setHover(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const rating = i + 1;
        const filled = rating <= (hover || value);

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-smooth duration-200",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
            )}
            onMouseEnter={() => !readonly && setHover(rating)}
            onClick={() => !readonly && onChange?.(rating)}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted/30 text-muted/30",
                "stroke-1 stroke-amber-400",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
