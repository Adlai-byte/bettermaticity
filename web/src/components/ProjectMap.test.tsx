import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
// Imported before the component: the useLanguage mock reads it when it loads.
import en from '@/locales/en.json';
import { ProjectMap } from './ProjectMap';
import { attributedCount, citywideCount, recordsByBarangay, totalCount } from '@/lib/projectMap';

vi.mock('@/hooks/useLanguage', () => {
  const dict = en as Record<string, string>;
  // Minimal i18next stand-in: plural _one/_other keys and {{var}} interpolation.
  const t = (key: string, opts?: Record<string, unknown>) => {
    let k = key;
    if (opts && typeof opts.count === 'number') {
      const plural = `${key}_${opts.count === 1 ? 'one' : 'other'}`;
      if (dict[plural]) k = plural;
    }
    const s = dict[k] ?? key;
    return opts ? s.replace(/\{\{(\w+)\}\}/g, (_, n: string) => String(opts[n] ?? '')) : s;
  };
  return { useLanguage: () => ({ language: 'en', t }) };
});

const CENTRAL = '1102509005';
const renderMap = (compact = false) =>
  render(
    <MemoryRouter>
      <ProjectMap compact={compact} />
    </MemoryRouter>
  );

describe('project map', () => {
  it('shades all 26 barangays and states the citywide totals', () => {
    const { container } = renderMap();
    expect(container.querySelectorAll('path[data-psgc]')).toHaveLength(26);
    const aside = container.querySelector('aside')!;
    for (const n of [totalCount, attributedCount, citywideCount])
      expect(within(aside).getAllByText(String(n)).length).toBeGreaterThan(0);
    expect(container.textContent).toContain('faeldon/philippines-json-maps');
  });

  it('lists a barangay’s records on click or select, and goes back to the overview', () => {
    const { container } = renderMap();
    const aside = () => container.querySelector('aside')!;
    fireEvent.click(container.querySelector(`path[data-psgc="${CENTRAL}"]`)!);
    expect(within(aside()).getByRole('heading', { name: 'Central' })).toBeTruthy();
    expect(aside().querySelectorAll('li')).toHaveLength(recordsByBarangay.get(CENTRAL)!.length);

    fireEvent.click(within(aside()).getByRole('button', { name: /Back to citywide/ }));
    expect(within(aside()).getByRole('heading', { name: 'Citywide overview' })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Choose a barangay'), { target: { value: CENTRAL } });
    expect(within(aside()).getByRole('heading', { name: 'Central' })).toBeTruthy();
  });

  it('selects a barangay from the keyboard', () => {
    const { container } = renderMap();
    const path = container.querySelector(`path[data-psgc="${CENTRAL}"]`)!;
    fireEvent.keyDown(path, { key: 'Enter' });
    expect(path.getAttribute('aria-pressed')).toBe('true');
  });

  it('keeps the Home teaser to the overview and links to the full map', () => {
    const { container } = renderMap(true);
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('path[role="button"]')).toBeNull();
    expect(screen.getByRole('link', { name: /Explore the project map/ })).toHaveAttribute(
      'href',
      '/transparency/projects#project-map'
    );
  });
});
