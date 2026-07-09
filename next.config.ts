import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On the `static-site` branch the app is snapshotted to a static `out/`
  // directory (see scripts/snapshot.mjs, `npm run generate`) and hosted on
  // free static hosting. Trailing slashes make each page map cleanly to a
  // `<path>/index.html` file on a static host.
  //
  // (The full server + Docker version lives on `main`, tag `server-version`.)
  trailingSlash: true,
};

export default nextConfig;
