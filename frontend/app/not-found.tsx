import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center justify-center px-6 mesh-gradient">
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/50 pointer-events-none" />
      <div className="relative z-10 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-1 ring-1 ring-white/6">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            Error 404
          </span>
        </div>
        <h1 className="mb-4 text-8xl font-bold tracking-tighter text-foreground md:text-9xl">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mb-10 text-sm text-muted-foreground/60 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="gap-2">
          <Link href="/">
            <ArrowLeftIcon className="size-4" weight="bold" />
            Go Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
