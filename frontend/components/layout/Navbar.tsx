"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useCallback } from "react";
import { SignOut, User, Sun, Moon } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

const links = [{ href: "/", label: "Home" }];

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  }, [router]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-5 left-1/2 z-40 -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/[0.02] ring-1 ring-black/10 dark:ring-white/[0.08]" />
          <div className="relative glass-nav rounded-full px-1.5 py-1">
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="mr-3 pl-4 text-sm font-semibold tracking-tight text-foreground"
              >
                ReviewHub
              </Link>

              <div className="hidden items-center gap-0.5 md:flex">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      pathname === href
                        ? "bg-black/5 dark:bg-white/[0.08] text-foreground"
                        : "text-muted-foreground/80 hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                    )}
                  >
                    {label}
                  </Link>
                ))}
                {!isLoading && isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      pathname === "/dashboard"
                        ? "bg-black/5 dark:bg-white/[0.08] text-foreground"
                        : "text-muted-foreground/80 hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              <div className="hidden items-center gap-1 pl-2 md:flex">
                {!isLoading && isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 mr-1">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-muted-foreground/80 whitespace-nowrap">
                        {user?.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04] active:scale-[0.97]"
                    >
                      <SignOut className="size-3.5" weight="duotone" />
                      {isPending ? "Signing out..." : "Logout"}
                    </button>
                  </>
                ) : isLoading ? (
                  <div className="px-2">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="group relative inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.97]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="hidden md:flex size-9 items-center justify-center rounded-full text-muted-foreground/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04] active:scale-[0.97]"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" weight="duotone" />
                ) : (
                  <Moon className="size-4" weight="duotone" />
                )}
              </button>

              <button
                className="relative z-50 ml-2 flex size-9 items-center justify-center rounded-full text-muted-foreground/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative size-4">
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileOpen
                        ? "top-1/2 -translate-y-1/2 rotate-45"
                        : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      mobileOpen
                        ? "top-1/2 -translate-y-1/2 -rotate-45"
                        : "bottom-0",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-white/90 backdrop-blur-3xl dark:bg-black/90 md:hidden">
          <Link
            href="/"
            className="text-4xl font-semibold text-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] translate-y-0 opacity-100"
            onClick={() => setMobileOpen(false)}
            style={{
              animation: "slide-up 0.5s 0.1s var(--ease-out-expo) both",
            }}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 text-lg font-medium text-muted-foreground/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
                onClick={() => setMobileOpen(false)}
                style={{
                  animation: "slide-up 0.5s 0.15s var(--ease-out-expo) both",
                }}
              >
                <User className="size-5" weight="duotone" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="flex items-center gap-3 text-lg font-medium text-muted-foreground/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
                style={{
                  animation: "slide-up 0.5s 0.2s var(--ease-out-expo) both",
                }}
              >
                <SignOut className="size-5" weight="duotone" />
                {isPending ? "Signing out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-lg font-medium text-muted-foreground/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
                onClick={() => setMobileOpen(false)}
                style={{
                  animation: "slide-up 0.5s 0.15s var(--ease-out-expo) both",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110"
                onClick={() => setMobileOpen(false)}
                style={{
                  animation: "slide-up 0.5s 0.2s var(--ease-out-expo) both",
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 text-lg font-medium text-muted-foreground/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
            style={{
              animation: "slide-up 0.5s 0.25s var(--ease-out-expo) both",
            }}
          >
            {theme === "dark" ? (
              <Sun className="size-5" weight="duotone" />
            ) : (
              <Moon className="size-5" weight="duotone" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </>
  );
}
