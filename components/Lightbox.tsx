"use client";

import { useCallback, useEffect, useState } from "react";

export interface LightboxLabels {
  closePhotoViewer: string;
  previousPhoto: string;
  nextPhoto: string;
  /** One pre-translated aria-label per photo, e.g. "View photo 2 of 5 full-screen". */
  photoAriaLabels: string[];
  /** Pre-translated dialog aria-label, e.g. "Sri Venkataramana Temple photo viewer". */
  viewerAriaLabel: string;
}

const DEFAULT_LABELS: LightboxLabels = {
  closePhotoViewer: "Close photo viewer",
  previousPhoto: "Previous photo",
  nextPhoto: "Next photo",
  photoAriaLabels: [],
  viewerAriaLabel: "photo viewer",
};

/**
 * Renders a thumbnail grid of real <img> tags (so photos still show with
 * JS disabled) and, on click, a full-screen lightbox overlay with
 * prev/next controls, a position indicator, and keyboard/click-to-close
 * support. This is progressive enhancement only — the thumbnails work as
 * plain images even if the overlay behaviour never activates.
 *
 * `labels` carries the already-translated UI strings from the server
 * parent (this is a client component and must not read cookies()/i18n
 * itself).
 */
export default function Lightbox({
  photos,
  title,
  labels = DEFAULT_LABELS,
}: {
  photos: string[];
  title: string;
  labels?: LightboxLabels;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, prev, next]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="gallery">
        {photos.map((photo, i) => (
          <button
            key={photo + i}
            type="button"
            className="gallery__item"
            onClick={() => setOpenIndex(i)}
            aria-label={labels.photoAriaLabels[i] ?? `${title} photo ${i + 1}`}
          >
            <img src={photo} alt={`${title} photo ${i + 1}`} />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={labels.viewerAriaLabel}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label={labels.closePhotoViewer}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            ✕
          </button>

          {photos.length > 1 ? (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              aria-label={labels.previousPhoto}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </button>
          ) : null}

          <img
            src={photos[openIndex]}
            alt={`${title} photo ${openIndex + 1}`}
            className="lightbox__image"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 ? (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              aria-label={labels.nextPhoto}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          ) : null}

          {photos.length > 1 ? (
            <div className="lightbox__count">
              {openIndex + 1} / {photos.length}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
