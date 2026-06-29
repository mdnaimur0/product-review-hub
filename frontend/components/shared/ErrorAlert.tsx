"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertCircle className="mx-auto mb-3 size-8 text-destructive" />
      <p className="mb-4 text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 size-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
