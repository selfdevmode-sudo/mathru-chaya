import { test } from "node:test";
import assert from "node:assert/strict";
import { localizeProject, localizeContent } from "./localize.ts";
import type { Project, Content } from "./types.ts";

const base: Project = {
  id: "p1",
  slug: "sri-venkataramana-temple",
  title: "Sri Venkataramana Temple",
  place: "Udupi",
  description: "Full restoration of the garbhagriha.",
  materials: ["Granite", "Teak wood"],
  ledBy: "Eshwara Nayak",
  photos: ["/uploads/a.jpg"],
};

test("english is returned untouched, even when translations exist", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ" } } };
  assert.equal(localizeProject(p, "en").title, "Sri Venkataramana Temple");
});

test("a record with no i18n renders exactly as before", () => {
  assert.deepEqual(localizeProject(base, "kn"), base);
});

// Localized records are handed to client components as props and get serialized
// into the page. Carrying the sidecar along would ship every language's text to
// every visitor.
test("the i18n sidecar is stripped from the localized record", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ" }, hi: { title: "श्री" } } };
  assert.equal("i18n" in localizeProject(p, "kn"), false);
  assert.equal("i18n" in localizeProject(p, "en"), false, "including on the English path");
});

test("fallback is per field, not per record", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ" } } };
  const kn = localizeProject(p, "kn");
  assert.equal(kn.title, "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ", "translated field wins");
  assert.equal(
    kn.description,
    "Full restoration of the garbhagriha.",
    "untranslated field falls back to English, not blank",
  );
});

// The regression this whole module exists to prevent: `?? ` returns "" for a
// cleared field, blanking the public site. Clearing a box must restore English.
test("an empty-string translation counts as absent", () => {
  const p: Project = { ...base, i18n: { kn: { title: "", description: "" } } };
  const kn = localizeProject(p, "kn");
  assert.equal(kn.title, "Sri Venkataramana Temple");
  assert.equal(kn.description, "Full restoration of the garbhagriha.");
});

test("a whitespace-only translation counts as absent", () => {
  const p: Project = { ...base, i18n: { kn: { title: "   \n\t " } } };
  assert.equal(localizeProject(p, "kn").title, "Sri Venkataramana Temple");
});

test("an empty materials array falls back to the English list", () => {
  const p: Project = { ...base, i18n: { kn: { materials: [] } } };
  assert.deepEqual(localizeProject(p, "kn").materials, ["Granite", "Teak wood"]);
});

test("a materials array of blanks falls back to the English list", () => {
  const p: Project = { ...base, i18n: { kn: { materials: ["", "  "] } } };
  assert.deepEqual(localizeProject(p, "kn").materials, ["Granite", "Teak wood"]);
});

test("a real materials array replaces the English list whole", () => {
  const p: Project = { ...base, i18n: { kn: { materials: ["ಗ್ರಾನೈಟ್"] } } };
  assert.deepEqual(localizeProject(p, "kn").materials, ["ಗ್ರಾನೈಟ್"]);
});

test("translating for hi does not pick up the kn translation", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ" } } };
  assert.equal(localizeProject(p, "hi").title, "Sri Venkataramana Temple");
});

test("localize does not mutate the source record", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ" } } };
  localizeProject(p, "kn");
  assert.equal(p.title, "Sri Venkataramana Temple");
});

test("non-translatable fields survive the overlay", () => {
  const p: Project = { ...base, i18n: { kn: { title: "ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವಸ್ಥಾನ" } } };
  const kn = localizeProject(p, "kn");
  assert.equal(kn.slug, "sri-venkataramana-temple", "URLs stay ASCII and stable");
  assert.equal(kn.ledBy, "Eshwara Nayak", "a person's name is never translated");
  assert.deepEqual(kn.photos, ["/uploads/a.jpg"]);
});

test("localizeContent walks every collection", () => {
  const content: Content = {
    site: { name: "X", tagline: "T", owners: [], phone: "1", whatsapp: "1", region: "R",
            i18n: { kn: { tagline: "ಟಿ" } } },
    projects: [{ ...base, i18n: { kn: { title: "ಶ್ರೀ" } } }],
    awards: [{ id: "a1", title: "Best", i18n: { kn: { title: "ಅತ್ಯುತ್ತಮ" } } }],
    testimonials: [{ id: "t1", name: "Ram", quote: "Good", i18n: { kn: { quote: "ಒಳ್ಳೆಯದು" } } }],
    services: [{ id: "s1", name: "Temples", i18n: { kn: { name: "ದೇವಸ್ಥಾನಗಳು" } } }],
    about: { body: "Story", i18n: { kn: { body: "ಕಥೆ" } } },
    gallery: ["/uploads/g1.jpg"],
  };
  const kn = localizeContent(content, "kn");
  assert.equal(kn.site.tagline, "ಟಿ");
  assert.equal(kn.site.name, "X", "business name is not translated");
  assert.equal(kn.projects[0].title, "ಶ್ರೀ");
  assert.equal(kn.awards[0].title, "ಅತ್ಯುತ್ತಮ");
  assert.equal(kn.testimonials[0].quote, "ಒಳ್ಳೆಯದು");
  assert.equal(kn.testimonials[0].name, "Ram", "a person's name is not translated");
  assert.equal(kn.services[0].name, "ದೇವಸ್ಥಾನಗಳು");
  assert.equal(kn.about.body, "ಕಥೆ");
  assert.deepEqual(kn.gallery, ["/uploads/g1.jpg"], "gallery passes through untranslated");
});
