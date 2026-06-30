export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ReviewHub
            </span>
            <p className="text-sm text-muted-foreground/60 max-w-xs text-center md:text-left">
              Real reviews from real people. Make confident decisions.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground/40">
              &copy; {new Date().getFullYear()} ReviewHub
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
