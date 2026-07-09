import { describe, it, expect } from 'vitest';
import { t, pickText, localePath } from '../src/lib/i18n';

describe('i18n', () => {
  it('returns English strings', () => {
    expect(t('en', 'nav_projects')).toBe('Projects');
  });
  it('returns Kannada strings', () => {
    expect(t('kn', 'nav_projects')).toBe('ಯೋಜನೆಗಳು');
  });
  it('falls back to English for missing translations', () => {
    // 'tu' has no strings file yet — must not crash, must show English
    expect(t('tu' as never, 'nav_projects')).toBe('Projects');
  });
  it('pickText prefers requested lang, falls back to en, else undefined', () => {
    const entry = { description_en: 'hello', description_kn: 'ನಮಸ್ಕಾರ' };
    expect(pickText('kn', entry, 'description')).toBe('ನಮಸ್ಕಾರ');
    expect(pickText('kn', { description_en: 'hello' }, 'description')).toBe('hello');
    expect(pickText('en', {}, 'description')).toBeUndefined();
  });
  it('pickText falls back to English when the preferred-language field is empty', () => {
    expect(pickText('kn', { description_en: 'hello', description_kn: '' }, 'description')).toBe('hello');
    expect(pickText('kn', { description_en: 'hello', description_kn: '   ' }, 'description')).toBe('hello');
  });
  it('localePath leaves en at root and prefixes others', () => {
    expect(localePath('en', '/projects/')).toBe('/projects/');
    expect(localePath('kn', '/projects/')).toBe('/kn/projects/');
  });
});
