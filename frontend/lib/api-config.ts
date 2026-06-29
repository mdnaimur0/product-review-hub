import type { CreateClientConfig } from "./api/client.gen";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export const createClientConfig: CreateClientConfig = (config) => ({
  ...(config || {}),
  baseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL as string) || config?.baseUrl,
  credentials: "include",
  auth: async () => {
    const token = getCookie("accessToken");
    return token;
  },
});
