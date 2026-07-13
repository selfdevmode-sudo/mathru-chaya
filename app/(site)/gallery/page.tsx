import { readContent } from "@/lib/db";
import { getLang, t } from "@/lib/i18n";
import Lightbox from "@/components/Lightbox";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: t(await getLang(), "nav_gallery") };
}

export default async function GalleryPage() {
  const content = await readContent();
  const lang = await getLang();
  const { gallery } = content;

  const heading = t(lang, "gallery_heading");
  const photoLabels = gallery.map((_, i) =>
    t(lang, "photo_view_full", { n: i + 1, total: gallery.length }),
  );

  return (
    <div className="wrap section">
      <div className="section-head">
        <h1>{heading}</h1>
      </div>

      {gallery.length > 0 ? (
        <Lightbox
          photos={gallery}
          title={heading}
          labels={{
            closePhotoViewer: t(lang, "close_photo_viewer"),
            previousPhoto: t(lang, "previous_photo"),
            nextPhoto: t(lang, "next_photo"),
            rotatePhoto: t(lang, "rotate_photo"),
            photoAriaLabels: photoLabels,
            viewerAriaLabel: `${heading} ${t(lang, "photo_viewer_suffix")}`,
          }}
        />
      ) : (
        <div className="empty-state">{t(lang, "gallery_empty")}</div>
      )}
    </div>
  );
}
