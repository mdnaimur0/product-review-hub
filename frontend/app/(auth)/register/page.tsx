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
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="double-bezel">
          <form action={dispatch} className="double-bezel-inner bg-card p-8">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to get started
              </p>
            </div>
            <div className="space-y-5">
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
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
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
