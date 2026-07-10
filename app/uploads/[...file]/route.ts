import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Serves the photos the admin uploads.
 *
 * `next start` reads the list of files in `public/` **once, at boot**, and only
 * serves the files it saw then. A photo uploaded from the admin lands in
 * `public/uploads/` after that snapshot was taken, so Next 404s it and the page
 * shows a blank image until the server is restarted. (`next dev` re-reads the
 * folder per request, which is why this never appears in development.)
 *
 * Uploads are runtime content, not build assets, so they can't rely on that
 * snapshot. This handler reads them off disk on every request. Photos that were
 * already there at boot are still served by Next's own static handler, which
 * runs first — this catches the rest.
 */
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;

  const target = path.join(UPLOAD_DIR, ...file);
  // Refuse anything that escapes the upload folder (e.g. "../../.env").
  if (path.relative(UPLOAD_DIR, target).startsWith("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const type = CONTENT_TYPES[path.extname(target).toLowerCase()];
  if (!type) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const bytes = await fs.readFile(target);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": type,
        // Filenames are unique per upload, so a photo's bytes never change.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
