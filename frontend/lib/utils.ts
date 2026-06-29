import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthAuthJwtLoginError, AuthRegisterRegisterError } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: AuthRegisterRegisterError | AuthAuthJwtLoginError,
): string {
  if (typeof error.detail === "string") {
    return error.detail;
  }

  if (Array.isArray(error.detail)) {
    return error.detail.map((e) => e.msg).join(", ");
  }

  if (
    typeof error.detail === "object" &&
    error.detail !== null &&
    "reason" in error.detail
  ) {
    return (error.detail as { reason: string }).reason;
  }

  return "An unknown error occurred";
}
