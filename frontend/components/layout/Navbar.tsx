"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

const links = [{ href: "/", label: "Home" }];

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  };

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
        <div className="glass rounded-full border border-border/50 px-2 py-1.5 shadow-lg shadow-black/5">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="mr-4 pl-4 text-sm font-semibold tracking-tight text-foreground"
            >
              ReviewHub
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-smooth duration-300",
                    pathname === href
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              ))}
              {!isLoading && isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-smooth duration-300",
                    pathname === "/dashboard"
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="hidden items-center gap-1 pl-2 md:flex">
              {!isLoading && isAuthenticated ? (
                <>
                  <span className="mr-1 text-sm text-muted-foreground whitespace-nowrap">
                    {user?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    onClick={handleLogout}
                  >
                    <LogOut className="size-3.5" />
                    {isPending ? "Signing out..." : "Logout"}
                  </Button>
                </>
              ) : isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              className="ml-2 rounded-full p-2 text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 glass flex flex-col items-center justify-center gap-6 md:hidden animate-fade-in">
          <button
            className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>

          <Link
            href="/"
            className="text-3xl font-semibold text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-medium text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="size-5" />
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="gap-2 text-lg text-muted-foreground"
                disabled={isPending}
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                {isPending ? "Signing out..." : "Logout"}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-lg text-muted-foreground"
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg">
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
