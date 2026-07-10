"use client";

import { useEffect } from "react";

/**
 * Closes the mobile nav when you tap outside it or press Escape.
 *
 * The nav is a <details> element, which natively opens and closes only from its
 * own summary — tapping the page behind an open menu leaves it open. That's the
 * gap this fills.
 *
 * Enhancement only (ADR-0007): with JavaScript disabled the menu still opens
 * and closes from the hamburger, exactly as <details> always has. Nothing here
 * renders, so there is no markup to hydrate and nothing to go wrong.
 *
 * Safe on desktop: the panel there is forced visible by CSS
 * (`.nav-disclosure::details-content { content-visibility: visible }`)
 * regardless of the open attribute, so clearing `open` has no visual effect.
 */
export default function NavAutoClose() {
  useEffect(() => {
    const details =
      document.querySelector<HTMLDetailsElement>("details.nav-disclosure");
    if (!details) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!details.open) return;
      const target = event.target;
      if (target instanceof Node && details.contains(target)) return;
      details.open = false;
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !details.open) return;
      details.open = false;
      // Return focus to the hamburger, or it lands nowhere.
      details.querySelector("summary")?.focus();
    };

    // pointerdown, not click: closes as soon as the tap starts, and fires for
    // touch, pen and mouse alike.
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return null;
}
