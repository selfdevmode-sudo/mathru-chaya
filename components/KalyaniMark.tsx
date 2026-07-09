/**
 * The Kalyani Step motif — a small symmetric "stepped temple-tank" glyph:
 * three nested stepped levels descending to a center, evoking the stone
 * steps of a kalyani/pushkarini (temple tank). Pure inline SVG, drawn with
 * `currentColor` so it inherits whatever text color it's placed in (usually
 * --c-gold). No client JS — this is a plain server component used as a
 * decorative, `aria-hidden` mark throughout the site (dividers, eyebrow
 * labels, the hero image frame).
 */
export default function KalyaniMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="1.5" y="1.5" width="25" height="25" />
      <rect x="7" y="7" width="14" height="14" />
      <rect x="12.5" y="12.5" width="3" height="3" />
    </svg>
  );
}
