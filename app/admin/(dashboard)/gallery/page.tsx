import { readContent } from "@/lib/db";
import { updateGallery } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import ProjectPhotos from "@/components/admin/ProjectPhotos";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await readContent();
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <div className="admin-header">
        <h1>{t(lang, "admin_gallery")}</h1>
      </div>

      {params.saved ? <div className="success-banner">{t(lang, "saved")}</div> : null}

      {/* Reuses the project photo manager: it submits new files as `photos`
          and removed existing ones as `removePhotos`, which updateGallery
          reads with the same logic updateProject uses. */}
      <form action={updateGallery} className="form-card" encType="multipart/form-data">
        <ProjectPhotos
          existing={content.gallery}
          labels={{
            photosLabel: t(lang, "photos_label"),
            addRemoveHint: t(lang, "add_remove_hint"),
            noPhotosYet: t(lang, "no_photos_yet"),
            addImages: t(lang, "add_images"),
            removePhoto: t(lang, "remove_photo_aria"),
          }}
        />

        <div className="btn-row">
          <button type="submit" className="btn">
            {t(lang, "save")}
          </button>
        </div>
      </form>
    </div>
  );
}
