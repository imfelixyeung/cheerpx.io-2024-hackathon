import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

await jiti.import("./src/env.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cross-Origin-Embedder-Policy",
          value: "require-corp",
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
      ],
    },
  ],
};

export default nextConfig;
