export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 py-8">
      <p className="text-center text-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} ReviewHub. All rights reserved.
      </p>
    </footer>
  );
}
