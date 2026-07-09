import { defineConfig } from 'astro/config';
import { site } from './site.config';

export default defineConfig({
  site: site.url,
  // Dev-only overlay; hidden so the local preview looks like the real site.
  devToolbar: { enabled: false },
});
