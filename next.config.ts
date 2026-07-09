import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Node server runtime (not static export) — admin writes to the filesystem
  // at request time, so this app must run on a persistent Node host.
};

export default nextConfig;
