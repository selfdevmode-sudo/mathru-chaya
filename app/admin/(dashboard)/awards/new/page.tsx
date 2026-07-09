import Link from "next/link";
import { createAward } from "@/lib/actions";
import AwardForm from "@/components/admin/AwardForm";

export const metadata = { title: "Add Award" };

export default async function NewAwardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <Link href="/admin/awards" className="back-link">
        ← Back to awards
      </Link>
      <div className="admin-header">
        <h1>Add Award</h1>
      </div>

      {params.error ? <div className="error-banner">{params.error}</div> : null}

      <AwardForm action={createAward} submitLabel="Create award" />
    </div>
  );
}
