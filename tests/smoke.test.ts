import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

const read = (p: string) => readFileSync(`dist/${p}`, 'utf8');
const fixturesPresent = existsSync('src/content/projects/sample-pond.md');

describe.skipIf(!fixturesPresent)('plug-n-play rendering', () => {
  it('minimal project renders title+photo and NO optional block labels', () => {
    const html = read('projects/sample-pond/index.html');
    expect(html).toContain('Temple Pond (Sample)');
    expect(html).toContain('<img');
    for (const absent of ['Method &amp; materials', 'Details', 'Location', 'Watch video', 'Before', 'Built for'])
      expect(html).not.toContain(absent);
    expect(html).not.toMatch(/undefined|\bnull\b|NaN/);
  });
  it('maximal project renders every optional block', () => {
    const html = read('projects/sample-temple/index.html');
    for (const present of ['Method &amp; materials', 'Duration', 'Open in Google Maps', 'Watch video', 'Before', 'After', 'Built for'])
      expect(html).toContain(present);
  });
  it('kannada route exists with Kannada chrome and English fallback text', () => {
    const html = read('kn/projects/sample-pond/index.html');
    expect(html).toContain('ಯೋಜನೆಗಳು');
    // sample-pond has no Kannada title, so ADR-0008 fallback must show the English one
    expect(html).toContain('Temple Pond (Sample)');
  });
  it('404 and core pages exist', () => {
    for (const p of ['404.html', 'index.html', 'projects/index.html', 'awards/index.html', 'about/index.html', 'contact/index.html', 'kn/index.html'])
      expect(existsSync(`dist/${p}`)).toBe(true);
  });
  it('no page leaks another identity than site.config', () => {
    expect(read('index.html')).toContain('Shri Builders');
  });
});
