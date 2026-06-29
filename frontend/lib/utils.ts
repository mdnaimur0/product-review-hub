import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthAuthJwtLoginError, AuthRegisterRegisterError } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApiError =
  | AuthRegisterRegisterError
  | AuthAuthJwtLoginError
  | { detail: string | Record<string, string> | Array<{ msg: string }> }
  | string;

export function getErrorMessage(error: ApiError): string {
  if (typeof error === "string") {
    return error;
  }

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
