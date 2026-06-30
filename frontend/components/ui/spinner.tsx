import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <CircleNotch
      className={cn("size-4 animate-spin text-muted-foreground/60", className)}
      weight="bold"
    />
  );
}
