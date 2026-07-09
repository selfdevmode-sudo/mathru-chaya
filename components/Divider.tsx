import KalyaniMark from "@/components/KalyaniMark";

/** Section divider: a centered hairline with the Kalyani Step mark in the
 * middle, in brass/gold. Used between home page sections. */
export default function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider__line" />
      <KalyaniMark size={22} className="divider__mark" />
      <span className="divider__line" />
    </div>
  );
}
