import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 pt-40 pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-[calc(var(--radius-4xl)+0.25rem)]" />
          <div className="space-y-5">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>
    </main>
  );
}
