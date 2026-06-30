import { Package } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "There's nothing to show right now.",
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[var(--bg-subtle)] ring-1 ring-[var(--ring-subtle)]">
        <Package className="size-7 text-muted-foreground/40" weight="light" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground/60">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild variant="outline">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
