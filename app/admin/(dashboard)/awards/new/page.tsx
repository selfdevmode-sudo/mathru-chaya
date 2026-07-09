import Link from "next/link";
import { createAward } from "@/lib/actions";
import { getLang, t } from "@/lib/i18n";
import AwardForm from "@/components/admin/AwardForm";

export const metadata = { title: "Add Award" };

export default async function NewAwardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const lang = await getLang();

  return (
    <div>
      <Link href="/admin/awards" className="back-link">
        {t(lang, "back_to_awards")}
      </Link>
      <div className="admin-header">
        <h1>{t(lang, "add_award_title")}</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <AwardForm action={createAward} submitLabel={t(lang, "create_award")} lang={lang} />
    </div>
  );
}
