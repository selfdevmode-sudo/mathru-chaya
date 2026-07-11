import { test } from "node:test";
import assert from "node:assert/strict";
import { referencedUploads, orphanedUploads } from "./uploads.ts";
import type { Content } from "./types.ts";

function content(over: Partial<Content>): Content {
  return {
    site: { name: "", tagline: "", owners: [], phone: "", whatsapp: "", region: "" },
    projects: [],
    awards: [],
    testimonials: [],
    services: [],
    about: { body: "" },
    gallery: [],
    ...over,
  };
}

const proj = (photos: string[], beforeAfter?: { before: string; after: string }) => ({
  id: "p", slug: "p", title: "P", photos, beforeAfter,
});

test("referencedUploads gathers photos from every image-bearing field", () => {
  const c = content({
    projects: [proj(["/uploads/a.jpg", "/uploads/b.jpg"], {
      before: "/uploads/ba.jpg", after: "/uploads/aa.jpg",
    })],
    awards: [{ id: "aw", title: "A", photo: "/uploads/award.jpg" }],
    gallery: ["/uploads/g1.jpg", "/uploads/g2.jpg"],
    about: { body: "", heroPhoto: "/uploads/hero.jpg" },
  });
  assert.deepEqual(
    [...referencedUploads(c)].sort(),
    ["/uploads/a.jpg", "/uploads/aa.jpg", "/uploads/award.jpg", "/uploads/b.jpg",
     "/uploads/ba.jpg", "/uploads/g1.jpg", "/uploads/g2.jpg", "/uploads/hero.jpg"].sort(),
  );
});

test("only /uploads/ paths count — external URLs and empties are ignored", () => {
  const c = content({
    projects: [proj(["https://cdn.example.com/x.jpg", ""])],
    about: { body: "", heroPhoto: undefined },
  });
  assert.equal(referencedUploads(c).size, 0);
});

test("removing one photo from a project orphans exactly that file", () => {
  const before = referencedUploads(content({ projects: [proj(["/uploads/a.jpg", "/uploads/b.jpg"])] }));
  const after = content({ projects: [proj(["/uploads/a.jpg"])] }); // b removed
  assert.deepEqual(orphanedUploads(before, after), ["/uploads/b.jpg"]);
});

test("deleting a whole project orphans all its (uniquely-held) photos", () => {
  const before = referencedUploads(content({
    projects: [proj(["/uploads/a.jpg"]), proj(["/uploads/b.jpg"])],
  }));
  const after = content({ projects: [proj(["/uploads/a.jpg"])] }); // second project deleted
  assert.deepEqual(orphanedUploads(before, after), ["/uploads/b.jpg"]);
});

// The critical safety property: a file still referenced by ANOTHER record must
// never be deleted, even if one holder drops it.
test("a photo shared by two records is NOT orphaned when one drops it", () => {
  const shared = "/uploads/shared.jpg";
  const before = referencedUploads(content({
    projects: [proj([shared])],
    gallery: [shared],
  }));
  const after = content({ projects: [proj([])], gallery: [shared] }); // project drops it, gallery keeps it
  assert.deepEqual(orphanedUploads(before, after), [], "shared file stays while any reference remains");
});

test("replacing the About hero orphans the old hero", () => {
  const before = referencedUploads(content({ about: { body: "", heroPhoto: "/uploads/old.jpg" } }));
  const after = content({ about: { body: "", heroPhoto: "/uploads/new.jpg" } });
  assert.deepEqual(orphanedUploads(before, after), ["/uploads/old.jpg"]);
});

test("a pure add (no removal) orphans nothing", () => {
  const before = referencedUploads(content({ gallery: ["/uploads/a.jpg"] }));
  const after = content({ gallery: ["/uploads/a.jpg", "/uploads/b.jpg"] });
  assert.deepEqual(orphanedUploads(before, after), []);
});

test("a file already orphaned before the action is not re-collected", () => {
  // before-set doesn't contain a file that wasn't referenced to begin with,
  // so a stray file on disk is never touched by an unrelated edit.
  const before = referencedUploads(content({ gallery: ["/uploads/a.jpg"] }));
  const after = content({ gallery: ["/uploads/a.jpg"] }); // no change
  assert.deepEqual(orphanedUploads(before, after), []);
});
