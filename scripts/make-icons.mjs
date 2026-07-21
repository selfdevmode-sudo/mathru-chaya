// Builds the site's app icons from the Kalyani Step mark (the same glyph as
// components/KalyaniMark.tsx) into public/.
//
// Run with `npm run icons`. It is a one-off generator, not part of the build —
// re-run it only if the mark or the brand colours change. The outputs are
// committed, so a normal build/deploy needs nothing.
//
//   public/favicon.svg          — browser tab (scales to any size)
//   public/apple-touch-icon.png — 180x180, iOS "Add to Home Screen"
//   public/icon-192.png         — Android home screen / manifest
//   public/icon-512.png         — manifest, splash
//   public/icon-maskable.png    — 512x512 with the extra padding Android's
//                                 adaptive-icon crop needs (safe zone ~80%)

import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Kept in sync with lib/brand.ts (which the app itself imports; this script is
// plain node and can't import a .ts module without a build step).
const FIELD = "#8e3a21"; // --c-accent, deep laterite
const MARK = "#f3ece1"; // --c-bg, parchment

// The mark's own coordinate space, straight from KalyaniMark.tsx.
const MARK_BOX = 28;

/**
 * @param size      canvas size in px (also the viewBox)
 * @param coverage  fraction of the canvas the mark spans; smaller = more
 *                  padding, which is what a maskable icon needs so Android's
 *                  circle/squircle crop can't clip the glyph.
 * @param radius    corner radius of the field, 0 for the full-bleed maskable.
 */
function iconSvg(size, coverage, radius) {
  const scale = (size * coverage) / MARK_BOX;
  const offset = (size - MARK_BOX * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${FIELD}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${MARK}" stroke-width="1.6">
    <rect x="1.5" y="1.5" width="25" height="25"/>
    <rect x="7" y="7" width="14" height="14"/>
    <rect x="12.5" y="12.5" width="3" height="3"/>
  </g>
</svg>`;
}

const OUT = "public";
const png = (svg, size, file) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT, file));

async function main() {
  // Tab favicon: small radius, mark fills most of the tile so it stays legible
  // at 16px.
  await writeFile(path.join(OUT, "favicon.svg"), iconSvg(64, 0.72, 10), "utf8");

  const standard = iconSvg(512, 0.66, 96);
  await png(standard, 180, "apple-touch-icon.png");
  await png(standard, 192, "icon-192.png");
  await png(standard, 512, "icon-512.png");

  // Maskable: full-bleed field, mark pulled well inside the safe zone.
  await png(iconSvg(512, 0.5, 0), 512, "icon-maskable.png");

  console.log(
    "[icons] wrote favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable.png",
  );
}

main().catch((err) => {
  console.error(`[icons] FAILED: ${err.message}`);
  process.exit(1);
});
