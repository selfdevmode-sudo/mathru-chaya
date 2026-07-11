# Gallery / Album — design spec

**Date:** 2026-07-11
**Status:** approved

## Problem

The owner wants a place to show miscellaneous temple photos — shots that don't
belong to any specific project and shouldn't appear in "Our Work." They also
want visitors to browse those photos in the same slidable full-screen viewer the
project pages already use, and a rotate button in that viewer.

## Scope

**In.** A standalone Gallery: a `string[]` of photos on `content.json`, an admin
page to add/remove them, a public page that shows them in a grid + lightbox, a
temporary rotate control in the lightbox, and the "Gallery" nav entry.

**Out.** Captions, per-photo pages, linking gallery photos to projects,
persisting rotation, aggregating project photos into the gallery. The gallery is
its own independent set of images.

## Data model

One new field:

```ts
interface Content {
  // …
  gallery: string[]; // photo paths under /uploads/, in display order
}
```

Photos are plain URL strings, exactly like `Project.photos`. No per-item object,
no id — removal is by value, and upload filenames are already unique. Optional in
practice: `readContent`'s normalizer defaults a missing `gallery` key to `[]`, so
the existing `content.json` needs no migration.

No translations: the photos carry no text (ADR-0009 doesn't apply).

## Admin

New sidebar entry "Gallery" → `/admin/gallery`. The page is a single form:

- The existing `components/admin/ProjectPhotos` manager, unchanged, seeded with
  `content.gallery`. It already submits new files as `photos` and removed
  existing ones as `removePhotos`, add/remove one at a time before Save.
- A Save button. Action: `updateGallery`.

`updateGallery` mirrors `updateProject`'s photo logic exactly: keep existing
photos minus the `removePhotos` set, append newly-uploaded files (via
`saveUpload`), write through the atomic `writeContent`. Reusing the same field
names means `ProjectPhotos` needs no change.

Like the rest of admin photo management, this relies on JavaScript (the
`DataTransfer` sync in `ProjectPhotos`) — consistent with the existing project
form, not a new gap.

## Public

New page `/gallery` (+ `/kn/gallery/`, `/hi/gallery/` via the existing middleware
rewrite and static crawl). It reuses `components/Lightbox`, which already renders
the thumbnail grid *and* the slidable full-screen viewer (prev/next, counter,
keyboard arrows, Escape). The page:

- reads `content.gallery`;
- if empty, renders an empty-state message (like the awards page) — the page
  stays in the nav so it's reachable, it just says there's nothing yet;
- otherwise renders `<Lightbox photos={gallery} title={…} labels={…} />`.

"Gallery" is added to the public nav after "Our Work."

## Lightbox changes

The Lightbox is shared by project pages and the gallery, so these apply
everywhere it's used.

1. **Rotate button** in the full-screen viewer. Each tap rotates the on-screen
   image +90° via a CSS `transform`, for that visitor only. Rotation state resets
   to 0 whenever the viewer opens, moves to another photo (prev/next), or closes —
   so it never carries between photos and never persists.

2. **Background scroll lock.** While the viewer is open, `document.body` gets
   `overflow: hidden`, restored on close. (A long project page currently scrolls
   behind the overlay.)

3. **Focus management.** On open, focus moves into the dialog; Tab is trapped
   within it; on close, focus returns to the element that opened it. This makes
   the existing `role="dialog" aria-modal="true"` honest.

All three are guarded to no-op when the viewer is closed, and are pure
enhancement — with JS disabled the thumbnails are still plain `<img>` links to
nothing (the grid degrades to static images, as today).

## Strings

Reuse the existing photo-manager and lightbox keys. New keys (en/kn/hi):
`nav_gallery`, `gallery_heading`, `gallery_empty`, `admin_gallery`,
`rotate_photo`.

## Static generation

Add `"/gallery/"` to `publicPaths()` in `scripts/snapshot.mjs`, so it's crawled
in all three languages like every other page.

## Error handling

- Missing `gallery` key → `[]` (normalizer). Empty gallery → empty-state page.
- A gallery photo whose file is missing → a broken `<img>`, same as any other
  photo on the site; not a crash.
- `updateGallery` with no changes → writes the same list back; harmless.

## Verification

1. Add photos in `/admin/gallery`, Save → they appear on `/gallery/`.
2. Remove one, Save → it's gone from `/gallery/` and dropped from `content.json`
   (the file on disk is left in place, matching current project behaviour).
3. Open a photo → slider works (prev/next/counter/arrows/Escape); rotate turns
   the image and resets on next/close; background doesn't scroll; focus returns
   to the thumbnail on close.
4. `/kn/gallery/` and `/hi/gallery/` render with localized nav/heading.
5. Empty gallery → `/gallery/` shows the empty-state, no crash.
6. `npm run generate` includes `out/gallery/`, `out/kn/gallery/`,
   `out/hi/gallery/`.
7. Existing `content.json` (no `gallery` key) loads and renders unchanged.
