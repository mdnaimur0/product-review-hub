"use client";

import { register } from "@/app/(auth)/actions";
import { FieldError, FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const [state, dispatch] = useActionState(register, undefined);
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
                  Get Started
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="text-sm text-muted-foreground/60">
                Enter your details to get started
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
                <FieldError state={state} field="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <FieldError state={state} field="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input id="password" name="password" type="password" required />
                <FieldError state={state} field="password" />
              </div>
              <SubmitButton text="Create Account" />
              <FormError state={state} />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground/60">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:brightness-110 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
