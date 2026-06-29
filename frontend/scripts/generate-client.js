import "dotenv/config";

import { createClient } from "@hey-api/openapi-ts";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env file");
}
const url = new URL(NEXT_PUBLIC_API_BASE_URL);
url.pathname = "/openapi.json";

createClient({
  input: url.toString(),
  output: {
    path: "lib/api",
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
      runtimeConfigPath: "@/lib/api-config",
      baseUrl: true,
    },
  ],
});
