/**
 * The handful of brand colours that cannot be CSS custom properties.
 *
 * ADR-0006 bans literal colours in components: everything visual must go
 * through the theme variables in globals.css. Two surfaces can't — the
 * `theme-color` meta tag (which colours the phone browser's address bar) and
 * the web manifest / icon files, neither of which is CSS. Rather than sprinkle
 * hex codes through metadata and scripts, they are named once here and must
 * stay in sync with the `:root` block in app/globals.css.
 */

/** --c-bg — warm laterite-tinted parchment. The page's own background. */
export const BRAND_BG = "#f3ece1";

/** --c-accent — deep laterite/kavi red. */
export const BRAND_ACCENT = "#8e3a21";

/** --c-granite — granite charcoal, the icon's field colour. */
export const BRAND_GRANITE = "#3b342c";

/** --c-gold — brass, used for the mark's hairlines. */
export const BRAND_GOLD = "#b0842f";
