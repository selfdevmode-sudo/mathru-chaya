"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Renders a thumbnail grid of real <img> tags (so photos still show with
 * JS disabled) and, on click, a full-screen lightbox overlay with
 * prev/next controls, a position indicator, and keyboard/click-to-close
 * support. This is progressive enhancement only — the thumbnails work as
 * plain images even if the overlay behaviour never activates.
 */
export default function Lightbox({
  photos,
  title,
}: {
  photos: string[];
  title: string;
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
            aria-label={`View photo ${i + 1} of ${photos.length} full-screen`}
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
          aria-label={`${title} photo viewer`}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close photo viewer"
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
              aria-label="Previous photo"
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
              aria-label="Next photo"
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
