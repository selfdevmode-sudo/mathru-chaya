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

/**
 * Lets a visitor preview the site as "Web" or "Mobile" regardless of their
 * actual screen size, persisted in localStorage. The heavy lifting (which
 * layout tokens apply) lives in globals.css via html.force-web /
 * html.force-mobile; this component only flips the class + remembers the
 * choice. A tiny inline script in the root layout's <head> applies the
 * saved class before first paint so there is no flash back to "auto".
 */
export default function ViewToggle() {
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
    <div className="view-toggle" role="group" aria-label="Preview site layout">
      <button
        type="button"
        className={`view-toggle__btn${mode === "web" ? " is-active" : ""}`}
        onClick={() => choose("web")}
        aria-pressed={mode === "web"}
        title="Preview web layout"
      >
        🖥 Web
      </button>
      <button
        type="button"
        className={`view-toggle__btn${mode === "mobile" ? " is-active" : ""}`}
        onClick={() => choose("mobile")}
        aria-pressed={mode === "mobile"}
        title="Preview mobile layout"
      >
        📱 Mobile
      </button>
    </div>
  );
}
