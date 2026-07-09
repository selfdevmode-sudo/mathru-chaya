# Temple Construction Showcase

A white-label static website (Astro + Sveltia CMS + Cloudflare Pages) showcasing a traditional
temple/pond construction contractor's work — bilingual (English/Kannada), themeable, and simple
enough for a non-technical owner to update from a phone.

```
npm run dev           # local dev server
npm run build         # production build → dist/
npm test              # unit tests (vitest)
npm run test:smoke    # build + smoke tests against dist/
npm run check         # astro check (types/diagnostics)
```

- Project overview, architecture, and feature status: [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md)
- Why each major decision was made: [`docs/adr/`](docs/adr/)
- Going live (Cloudflare Pages, CMS auth, per-instance setup): [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- Owner's guide to adding content from a phone: [`docs/ONBOARDING.md`](docs/ONBOARDING.md)
