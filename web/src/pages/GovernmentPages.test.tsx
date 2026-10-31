import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import en from '@/locales/en.json';

// <Seo> needs vite-react-ssg's HelmetProvider, which unit tests don't mount.
vi.mock('@/components/Seo', () => ({ Seo: () => null }));
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

import Government from './Government';
import GovernmentOfficials from './GovernmentOfficials';
import GovernmentOffices from './GovernmentOffices';
import GovernmentBarangays from './GovernmentBarangays';
import { officials } from '@/lib/govData';
import { cityOfficeGroups, departments } from '@/lib/govDirectory';
import { barangayCount } from '@/lib/statsData';
afterEach(cleanup);

const renderAt = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
// Template-era placeholder contact details that must never be shown as fact.
const PLACEHOLDER_CONTACT = /@mati\.gov\.ph|326-50|0917-155-1043/;

describe('government hub', () => {
  it('links to the officials, offices and barangays pages', () => {
    const { container } = renderAt(<Government />);
    for (const href of ['/government/officials', '/government/offices', '/government/barangays'])
      expect(container.querySelector(`a[href="${href}"]`), href).toBeTruthy();
    expect(screen.getByRole('heading', { name: en['gov-channels-title'] })).toBeTruthy();
  });
});

describe('elected officials page', () => {
  it('lists every verified name and hides placeholder contact details', () => {
    const { container } = renderAt(<GovernmentOfficials />);
    const names = [officials.mayor!, officials.vice_mayor!, ...officials.councilors!].map(
      (o) => o.name
    );
    expect(names).toHaveLength(12);
    for (const name of names) expect(screen.getByRole('heading', { name })).toBeTruthy();
    expect(container.textContent).not.toMatch(PLACEHOLDER_CONTACT);
    expect(container.querySelector('a[href^="mailto:"], a[href^="tel:"]')).toBeNull();
  });

  it('filters councilors by name', () => {
    renderAt(<GovernmentOfficials />);
    const list = () => document.getElementById('councilors-list');
    expect(within(list()!).getAllByRole('listitem')).toHaveLength(10);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'pabio' } });
    expect(within(list()!).getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('city offices page', () => {
  it('lists every office, shows only the sourced CDRRMO number, and filters', () => {
    const { container } = renderAt(<GovernmentOffices />);
    const rows = () => within(document.getElementById('offices-list')!).getAllByRole('listitem');
    expect(rows()).toHaveLength(departments.length);
    const phones = container.querySelectorAll('a[href^="tel:"]');
    expect(phones).toHaveLength(1);
    expect(phones[0].textContent).toMatch(/verified hotline/);
    expect(container.textContent).not.toMatch(PLACEHOLDER_CONTACT);

    // The City's full list follows, grouped as the City groups them.
    const all = document.getElementById('all-offices')!.closest('section')!;
    expect(all.querySelectorAll('h3')).toHaveLength(cityOfficeGroups.length);
    expect(within(all).getByText('City Information Office')).toBeTruthy();

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'treasurer' } });
    expect(rows().length).toBeLessThan(departments.length);
    expect(rows().length).toBeGreaterThan(0);
  });
});

describe('barangays page', () => {
  it('lists every barangay with population and filters by name', () => {
    renderAt(<GovernmentBarangays />);
    const rows = () => within(document.getElementById('barangays-list')!).getAllByRole('listitem');
    expect(rows()).toHaveLength(barangayCount);
    expect(screen.getByText('Dahican')).toBeTruthy();

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'dahi' } });
    expect(rows()).toHaveLength(1);
  });
});
