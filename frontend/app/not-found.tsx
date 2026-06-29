import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-2 text-7xl font-bold tracking-tighter text-foreground/10">
          404
        </h1>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mb-8 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
