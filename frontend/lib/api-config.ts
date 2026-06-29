import type { CreateClientConfig } from "./api/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...(config || {}),
  baseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL as string) || config?.baseUrl,
  credentials: "include",
});
