import KalyaniMark from "./KalyaniMark";

/**
 * What a public section shows when the owner hasn't added anything to it yet.
 *
 * The pages used to reuse the admin's `.empty-state` — a white box with a
 * dashed grey border, in admin colours — which read to a visitor as an
 * unfinished CMS rather than a page of the site. This is the same information
 * dressed as part of the site: the Kalyani mark, the message, and a way to get
 * in touch, in theme colours.
 *
 * These sections are unlinked from the nav while they're empty (see
 * app/(site)/layout.tsx), so this is only reached by a direct/stale URL — it
 * still has to look deliberate.
 */
export default function EmptyState({
  message,
  actionHref,
  actionLabel,
}: {
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="section-empty">
      <KalyaniMark size={44} className="section-empty__mark" />
      <p>{message}</p>
      {actionHref && actionLabel ? (
        <a href={actionHref} className="btn btn-secondary">
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
