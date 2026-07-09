"use client";

import { useEffect, useState } from "react";

type ViewMode = "auto" | "web" | "mobile";

const STORAGE_KEY = "viewMode";

function applyMode(mode: ViewMode) {
  const root = document.documentElement;
  root.classList.remove("force-web", "force-mobile");
  if (mode === "web") root.classList.add("force-web");
  else if (mode === "mobile") root.classList.add("force-mobile");
}

export interface ViewToggleLabels {
  web: string;
  mobile: string;
  webTitle: string;
  mobileTitle: string;
  groupAria: string;
}

const DEFAULT_LABELS: ViewToggleLabels = {
  web: "Web",
  mobile: "Mobile",
  webTitle: "Preview web layout",
  mobileTitle: "Preview mobile layout",
  groupAria: "Preview site layout",
};

/**
 * Lets a visitor preview the site as "Web" or "Mobile" regardless of their
 * actual screen size, persisted in localStorage. The heavy lifting (which
 * layout tokens apply) lives in globals.css via html.force-web /
 * html.force-mobile; this component only flips the class + remembers the
 * choice. A tiny inline script in the root layout's <head> applies the
 * saved class before first paint so there is no flash back to "auto".
 *
 * `labels` is passed in (already translated) by the server layout — this is
 * a client component and must not read cookies()/i18n itself.
 */
export default function ViewToggle({
  labels = DEFAULT_LABELS,
}: {
  labels?: ViewToggleLabels;
}) {
  const [mode, setMode] = useState<ViewMode>("auto");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "web" || stored === "mobile") {
      setMode(stored);
    }
  }, []);

  function choose(next: ViewMode) {
    const resolved = mode === next ? "auto" : next;
    setMode(resolved);
    applyMode(resolved);
    if (resolved === "auto") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, resolved);
    }
  }

  return (
    <div className="view-toggle" role="group" aria-label={labels.groupAria}>
      <button
        type="button"
        className={`view-toggle__btn${mode === "web" ? " is-active" : ""}`}
        onClick={() => choose("web")}
        aria-pressed={mode === "web"}
        aria-label={labels.webTitle}
        title={labels.webTitle}
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
          <rect x="2.5" y="3.5" width="15" height="10" rx="1" />
          <line x1="7.5" y1="17" x2="12.5" y2="17" />
          <line x1="10" y1="13.5" x2="10" y2="17" />
        </svg>
      </button>
      <button
        type="button"
        className={`view-toggle__btn${mode === "mobile" ? " is-active" : ""}`}
        onClick={() => choose("mobile")}
        aria-pressed={mode === "mobile"}
        aria-label={labels.mobileTitle}
        title={labels.mobileTitle}
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
          <rect x="5.5" y="2.5" width="9" height="15" rx="1.5" />
          <line x1="8.5" y1="15" x2="11.5" y2="15" />
        </svg>
      </button>
    </div>
  );
}
