"use client";

import { login } from "@/app/(auth)/actions";
import { FieldError, FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const [state, dispatch] = useActionState(login, undefined);
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="double-bezel">
          <form action={dispatch} className="double-bezel-inner bg-card p-8">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground">
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
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
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
