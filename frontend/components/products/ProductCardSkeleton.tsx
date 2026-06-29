import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="double-bezel">
      <div className="double-bezel-inner bg-card">
        <Skeleton className="aspect-[4/3] rounded-none" />
        <div className="space-y-3 p-5">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="size-3.5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
