import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/db";
import { updateAward, deleteAward } from "@/lib/actions";
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

  if (!award) {
    notFound();
  }

  const boundUpdate = updateAward.bind(null, award.id);
  const boundDelete = deleteAward.bind(null, award.id);

  return (
    <div>
      <Link href="/admin/awards" className="back-link">
        ← Back to awards
      </Link>
      <div className="admin-header">
        <h1>Edit Award</h1>
      </div>

      <AwardForm award={award} action={boundUpdate} submitLabel="Save changes" />

      <div style={{ marginTop: "1.5rem" }}>
        <form action={boundDelete}>
          <ConfirmSubmitButton message={`Delete "${award.title}"?`}>
            Delete this award
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
