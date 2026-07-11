import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On the `static-site` branch the app is snapshotted to a static `out/`
  // directory (see scripts/snapshot.mjs, `npm run generate`) and hosted on
  // free static hosting. Trailing slashes make each page map cleanly to a
  // `<path>/index.html` file on a static host.
  //
  // (The full server + Docker version lives on `main`, tag `server-version`.)
  trailingSlash: true,

  experimental: {
    serverActions: {
      // Photo uploads go through server actions, which default to a 1 MB body
      // limit — far too small for phone photos (several MB each), so real
      // uploads failed with a 413 "Body exceeded 1 MB limit". This only ever
      // runs in the local admin (`npm start`); the deployed site is static and
      // never executes server actions, so a generous limit costs nothing.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
