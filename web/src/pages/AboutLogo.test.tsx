import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
// Imported before the component: the useLanguage mock reads it when it loads.
import en from '@/locales/en.json';
import AboutLogo from './AboutLogo';
import { LOGO_VERSIONS } from '@/lib/logoKit';

vi.mock('@/components/Seo', () => ({ Seo: () => null }));
vi.mock('@/hooks/useLanguage', () => {
  const dict = en as Record<string, string>;
  const t = (key: string, opts?: Record<string, unknown>) => {
    const s = dict[key] ?? key;
    return opts ? s.replace(/\{\{(\w+)\}\}/g, (_, n: string) => String(opts[n] ?? '')) : s;
  };
  return { useLanguage: () => ({ language: 'en', t }) };
});

describe('logo page', () => {
  it('explains the mark and links to the Sleeping Dinosaur', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutLogo />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: en['logo-title'] })).toBeTruthy();
    expect(screen.getByText(en['logo-part-dinosaur'], { selector: 'span' })).toBeTruthy();
    expect(container.querySelector('a[href="/visit-mati/sleeping-dinosaur"]')).toBeTruthy();
    expect(container.querySelector('a[href="/about"]')).toBeTruthy();
  });

  it('offers every logo file as a download, and states the license', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutLogo />
      </MemoryRouter>
    );
    for (const f of LOGO_VERSIONS.flatMap((v) => v.files)) {
      const link = container.querySelector(`a[href="${f.href}"]`);
      expect(link, f.href).toBeTruthy();
      expect(link!.hasAttribute('download'), f.href).toBe(true);
    }
    expect(screen.getByText(en['logo-credit-text'])).toBeTruthy();
    expect(
      container.querySelector('a[href="https://creativecommons.org/licenses/by/4.0/"]')
    ).toBeTruthy();
    // Independence is stated: the logo isn't the City's.
    expect(screen.getByText(en['logo-license-endorse'])).toBeTruthy();
  });
});
