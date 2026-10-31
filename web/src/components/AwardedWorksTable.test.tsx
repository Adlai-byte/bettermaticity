import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
// Imported before the component: the useLanguage mock reads it when it loads.
import en from '@/locales/en.json';
import { AwardedWorksTable } from './AwardedWorksTable';
import { awardedWorks } from '@/lib/awardedWorks';
import { mapRecords } from '@/lib/projectMap';

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

// Each work renders twice (table row for wide screens, stacked record for phones).
const rows = (c: HTMLElement) => c.querySelectorAll('#awarded-works-list tbody tr');

describe('awarded civil works table', () => {
  it('lists every work the map counts, ten to a page', () => {
    const { container } = render(<AwardedWorksTable />);
    expect(screen.getByText(`${awardedWorks.length} awarded works`)).toBeTruthy();
    expect(rows(container)).toHaveLength(Math.min(10, awardedWorks.length));
    // Every awarded work on the map is in this table.
    const mapped = mapRecords.filter((r) => r.kind === 'awarded').length;
    expect(mapped).toBe(awardedWorks.length);
  });

  it('filters by barangay, year and search, and links each row to the City report', () => {
    const { container } = render(<AwardedWorksTable />);
    fireEvent.change(screen.getByLabelText('Barangay'), { target: { value: 'Mayo' } });
    expect(rows(container)).toHaveLength(1);
    const link = rows(container)[0].querySelector('a')!;
    expect(link.getAttribute('href')).toContain('fdpp.dilg.gov.ph/fdpp/report/document-download');

    fireEvent.change(screen.getByLabelText('Barangay'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Bidding year'), { target: { value: '2026' } });
    const in2026 = awardedWorks.filter((w) => w.biddingDate.startsWith('2026')).length;
    expect(rows(container)).toHaveLength(Math.min(10, in2026));

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'liberty bridge' } });
    expect(rows(container)).toHaveLength(0);
    fireEvent.change(screen.getByLabelText('Bidding year'), { target: { value: '' } });
    expect(rows(container)).toHaveLength(1);
  });

  it('shows a bid the City printed unreadably as printed, not as a number', () => {
    const odd = awardedWorks.find((w) => w.bidAmount === null)!;
    const { container } = render(<AwardedWorksTable />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: odd.name } });
    expect(container.textContent).toContain(`Printed as “${odd.bidAmountAsPrinted}”`);
  });
});
