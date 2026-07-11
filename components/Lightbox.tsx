"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LightboxLabels {
  closePhotoViewer: string;
  previousPhoto: string;
  nextPhoto: string;
  rotatePhoto: string;
  /** One pre-translated aria-label per photo, e.g. "View photo 2 of 5 full-screen". */
  photoAriaLabels: string[];
  /** Pre-translated dialog aria-label, e.g. "Sri Venkataramana Temple photo viewer". */
  viewerAriaLabel: string;
}

const DEFAULT_LABELS: LightboxLabels = {
  closePhotoViewer: "Close photo viewer",
  previousPhoto: "Previous photo",
  nextPhoto: "Next photo",
  rotatePhoto: "Rotate photo",
  photoAriaLabels: [],
  viewerAriaLabel: "photo viewer",
};

/**
 * Renders a thumbnail grid of real <img> tags (so photos still show with
 * JS disabled) and, on click, a full-screen lightbox overlay with
 * prev/next controls, a rotate control, a position indicator, and
 * keyboard/click-to-close support. This is progressive enhancement only —
 * the thumbnails work as plain images even if the overlay behaviour never
 * activates.
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
  // Rotation is per-view only: it resets whenever the viewer opens, moves to
  // another photo, or closes. It never touches the stored image.
  const [rotation, setRotation] = useState(0);

  // The thumbnail that opened the viewer, so focus can return to it on close.
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const isOpen = openIndex !== null;

  const open = useCallback((index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setRotation(0);
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setRotation(0);
    // Return focus to the thumbnail that opened the viewer.
    triggerRef.current?.focus();
  }, []);

  const prev = useCallback(() => {
    setRotation(0);
    setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const next = useCallback(() => {
    setRotation(0);
    setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);

  const rotate = useCallback(() => setRotation((r) => (r + 90) % 360), []);

  // Keyboard: Escape closes, arrows navigate, and Tab is trapped inside the
  // dialog so focus can't wander to the page behind the modal overlay.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, prev, next]);

  // Lock background scroll while the viewer is open, and move focus into the
  // dialog so keyboard users start inside the modal.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="gallery">
        {photos.map((photo, i) => (
          <button
            key={photo + i}
            type="button"
            className="gallery__item"
            onClick={(e) => open(i, e.currentTarget)}
            aria-label={labels.photoAriaLabels[i] ?? `${title} photo ${i + 1}`}
          >
            <img src={photo} alt={`${title} photo ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={labels.viewerAriaLabel}
          onClick={close}
        >
          <div className="lightbox__toolbar">
            <button
              type="button"
              className="lightbox__tool"
              aria-label={labels.rotatePhoto}
              onClick={(e) => {
                e.stopPropagation();
                rotate();
              }}
            >
              {/* rotate-clockwise glyph */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            <button
              type="button"
              className="lightbox__tool lightbox__close"
              aria-label={labels.closePhotoViewer}
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              ✕
            </button>
          </div>

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
            style={{ transform: `rotate(${rotation}deg)` }}
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
