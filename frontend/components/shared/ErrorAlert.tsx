"use client";

import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-8 text-center">
      <WarningCircle
        className="mx-auto mb-4 size-8 text-red-400/60"
        weight="light"
      />
      <p className="mb-5 text-sm text-red-400/80">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <ArrowClockwise className="size-3.5" weight="bold" />
          Try Again
        </Button>
      )}
    </div>
  );
}
