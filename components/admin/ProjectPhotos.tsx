"use client";

import { useEffect, useId, useRef, useState } from "react";

interface PendingPhoto {
  id: string;
  file: File;
  url: string;
}

export interface ProjectPhotosLabels {
  photosLabel: string;
  addRemoveHint: string;
  noPhotosYet: string;
  addImages: string;
  removePhoto: string;
}

const DEFAULT_LABELS: ProjectPhotosLabels = {
  photosLabel: "Photos",
  addRemoveHint: "(add or remove one at a time)",
  noPhotosYet: "No photos yet.",
  addImages: "Add images",
  removePhoto: "Remove this photo",
};

/**
 * Lets an admin add and remove project photos one at a time (in as many
 * batches as they like) before hitting Save, while still submitting through
 * the existing `createProject`/`updateProject` server actions unchanged:
 *
 * - Existing photos the user removes are recorded as hidden
 *   `<input name="removePhotos">` fields (the action reads these with
 *   `formData.getAll("removePhotos")`).
 * - Newly picked files are kept in React state (for previews + one-by-one
 *   removal) and mirrored into a single hidden `<input type="file"
 *   name="photos" multiple>` via a DataTransfer object, so the action's
 *   `formData.getAll("photos")` still sees exactly the files the admin
 *   decided to keep, in order.
 *
 * `labels` carries the already-translated UI strings from the server
 * parent (ProjectForm) — this is a client component and must not read
 * cookies()/i18n itself.
 */
export default function ProjectPhotos({
  existing,
  labels = DEFAULT_LABELS,
}: {
  existing: string[];
  labels?: ProjectPhotosLabels;
}) {
  const [keptExisting, setKeptExisting] = useState<string[]>(existing);
  const [removed, setRemoved] = useState<string[]>([]);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Keep the real (hidden) file input's FileList in sync with `pending`
  // any time it changes — append or remove, we just rebuild it via a
  // fresh DataTransfer, which is the only way to script a FileList.
  useEffect(() => {
    const dt = new DataTransfer();
    pending.forEach((p) => dt.items.add(p.file));
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
    }
  }, [pending]);

  // Revoke object URLs when the component unmounts so we don't leak memory.
  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      const additions = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      // Append — picking more files in a later batch adds to the pending
      // list rather than replacing it.
      setPending((prev) => [...prev, ...additions]);
    }
    // Reset the visible picker so choosing the same file again still fires
    // a change event; this input is not the one submitted with the form.
    e.target.value = "";
  }

  function removeExisting(photo: string) {
    setKeptExisting((prev) => prev.filter((p) => p !== photo));
    setRemoved((prev) => [...prev, photo]);
  }

  function removePending(id: string) {
    setPending((prev) => {
      const match = prev.find((p) => p.id === id);
      if (match) URL.revokeObjectURL(match.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  const hasPhotos = keptExisting.length > 0 || pending.length > 0;

  return (
    <div className="field photo-manager">
      <label htmlFor={inputId}>
        {labels.photosLabel} <span className="hint">{labels.addRemoveHint}</span>
      </label>

      {hasPhotos ? (
        <div className="photo-grid">
          {keptExisting.map((photo) => (
            <div key={photo} className="photo-thumb">
              <img src={photo} alt="" />
              <button
                type="button"
                className="photo-thumb__remove"
                aria-label={labels.removePhoto}
                onClick={() => removeExisting(photo)}
              >
                ✕
              </button>
            </div>
          ))}
          {pending.map((p) => (
            <div key={p.id} className="photo-thumb">
              <img src={p.url} alt="" />
              <button
                type="button"
                className="photo-thumb__remove"
                aria-label={labels.removePhoto}
                onClick={() => removePending(p.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="hint" style={{ margin: "0 0 0.75rem" }}>
          {labels.noPhotosYet}
        </p>
      )}

      <label className="btn btn-secondary photo-add-btn" htmlFor={inputId}>
        + {labels.addImages}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePick}
        />
      </label>

      {/* The input actually submitted with the form. Its FileList is kept
          in sync with `pending` above via DataTransfer — the server action
          reads it unchanged as formData.getAll("photos"). */}
      <input ref={fileInputRef} type="file" name="photos" multiple hidden />

      {/* One hidden input per removed existing photo — matches
          formData.getAll("removePhotos") in updateProject exactly. Photos
          that were kept need no input at all; the action keeps them by
          default. */}
      {removed.map((photo) => (
        <input key={photo} type="hidden" name="removePhotos" value={photo} />
      ))}
    </div>
  );
}
