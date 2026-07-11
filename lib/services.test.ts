import { test } from "node:test";
import assert from "node:assert/strict";
import { parseServices } from "./services.ts";
import type { Service } from "./types.ts";

function form(pairs: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(pairs)) fd.set(k, v);
  return fd;
}

let idN = 0;
const mkId = () => `new-${++idN}`;

test("parses contiguous rows, dropping empty-name rows", () => {
  const fd = form({
    "service.0.name": "Temple Construction",
    "service.0.blurb": "New temples from foundation to kalasha.",
    "service.1.name": "", // empty → dropped
    "service.1.blurb": "orphan blurb",
    "service.2.name": "Pond Building",
    // no service.3.name → iteration stops
  });
  const out = parseServices(fd, [], mkId);
  assert.equal(out.length, 2);
  assert.deepEqual(out.map((s) => s.name), ["Temple Construction", "Pond Building"]);
  assert.equal(out[0].blurb, "New temples from foundation to kalasha.");
  assert.equal(out[1].blurb, undefined, "no blurb field → undefined, not empty string");
});

test("collects kn/hi translations for a row", () => {
  const fd = form({
    "service.0.name": "Temple Construction",
    "service.0.blurb": "New temples.",
    "service.0.kn.name": "ದೇವಾಲಯ ನಿರ್ಮಾಣ",
    "service.0.kn.blurb": "ಹೊಸ ದೇವಾಲಯಗಳು.",
    "service.0.hi.name": "मंदिर निर्माण",
  });
  const out = parseServices(fd, [], mkId);
  assert.deepEqual(out[0].i18n, {
    kn: { name: "ದೇವಾಲಯ ನಿರ್ಮಾಣ", blurb: "ಹೊಸ ದೇವಾಲಯಗಳು." },
    hi: { name: "मंदिर निर्माण" },
  });
});

test("a row with no non-empty translation gets no i18n key", () => {
  const fd = form({
    "service.0.name": "Temple Construction",
    "service.0.kn.name": "   ", // whitespace only → dropped
  });
  assert.equal(parseServices(fd, [], mkId)[0].i18n, undefined);
});

test("reuses the existing service id at the same position", () => {
  const existing: Service[] = [
    { id: "svc-1", name: "Old A" },
    { id: "svc-2", name: "Old B" },
  ];
  const fd = form({
    "service.0.name": "New A",
    "service.1.name": "New B",
  });
  const out = parseServices(fd, existing, mkId);
  assert.equal(out[0].id, "svc-1");
  assert.equal(out[1].id, "svc-2");
});

test("a brand-new row (beyond existing) gets a fresh id", () => {
  const fd = form({
    "service.0.name": "A",
    "service.1.name": "B",
  });
  const out = parseServices(fd, [{ id: "svc-1", name: "A" }], mkId);
  assert.equal(out[0].id, "svc-1");
  assert.match(out[1].id, /.+/);
  assert.notEqual(out[1].id, "svc-1");
});

test("no service rows at all → empty list", () => {
  assert.deepEqual(parseServices(form({ name: "Business" }), [], mkId), []);
});

test("clearing all names removes every service", () => {
  const fd = form({ "service.0.name": "", "service.1.name": "" });
  assert.deepEqual(parseServices(fd, [{ id: "s", name: "X" }], mkId), []);
});
