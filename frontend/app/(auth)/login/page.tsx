"use client";

import { login } from "@/app/(auth)/actions";
import { FieldError, FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";

export default function Page() {
  const [state, dispatch] = useActionState(login, undefined);

  useEffect(() => {
    if (
      state &&
      typeof state === "object" &&
      "success" in state &&
      state.success === true
    ) {
      window.location.href = "/dashboard";
    }
  }, [state]);

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-6 mesh-gradient">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <div className="double-bezel">
          <form
            action={dispatch}
            className="double-bezel-inner bg-card p-8 md:p-10"
          >
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--bg-muted)] px-3 py-1 ring-1 ring-[var(--ring-subtle)]">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                  Welcome Back
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                Sign In
              </h1>
              <p className="text-sm text-muted-foreground/60">
                Sign in to your account to continue
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
                <FieldError state={state} field="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input id="password" name="password" type="password" required />
                <FieldError state={state} field="password" />
              </div>
              <SubmitButton text="Sign In" />
              <FormError state={state} />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:brightness-110 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
