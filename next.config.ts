import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Node server runtime (not static export) — admin writes to the filesystem
  // at request time, so this app must run on a persistent Node host.
  //
  // "standalone" bundles a minimal self-contained server into
  // .next/standalone so the Docker image can run without the full
  // node_modules. Local `npm start` still works exactly the same.
  output: "standalone",
};

export default nextConfig;
