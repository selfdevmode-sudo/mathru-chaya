import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateAward, deleteAward } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import AwardForm from "@/components/admin/AwardForm";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Award" };

export default async function EditAwardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await readContent();
  const award = content.awards.find((a) => a.id === id);
  const lang = await getLang();

  if (!award) {
    notFound();
  }

  const boundUpdate = updateAward.bind(null, award.id);
  const boundDelete = deleteAward.bind(null, award.id);

  return (
    <div>
      <Link href="/admin/awards" className="back-link">
        {t(lang, "back_to_awards")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "edit_award")}</h1>
      </div>

      <AwardForm award={award} action={boundUpdate} submitLabel={t(lang, "save_changes")} lang={lang} />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={t(lang, "confirm_delete_award", { title: award.title })}>
            {t(lang, "delete_this_award")}
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
