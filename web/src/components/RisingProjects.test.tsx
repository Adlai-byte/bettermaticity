import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
// Imported before the components: the useLanguage mock reads it when they load.
import en from '@/locales/en.json';
import { RisingProjects } from './RisingProjects';
import { ProjectLedger } from './ProjectLedger';
import { featuredProjects, risingProjects, projectAnchor } from '@/lib/risingProjects';
import { procurementNotices } from '@/lib/infrastructureData';
import ceb from '@/locales/ceb.json';

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

const translate = (key: string) => (en as Record<string, string>)[key];

describe('Rising in Mati evidence and navigation', () => {
  it('links every Home highlight to a project in the ledger with the same title and status', () => {
    const { rerender, container } = render(<RisingProjects />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    const links = featuredProjects.map((project) => {
      const link = screen.getByRole('link', { name: new RegExp(translate(project.titleKey)) });
      expect(link).toHaveTextContent(translate(`rising-status-${project.status}`));
      expect(link).toHaveTextContent(project.sourceDate);
      return link.getAttribute('href')!;
    });
    expect(screen.getByRole('link', { name: 'View all projects' })).toHaveAttribute(
      'href',
      '/transparency/projects#rising-in-mati'
    );
    rerender(<ProjectLedger />);
    expect(container.querySelectorAll('#project-ledger > li')).toHaveLength(risingProjects.length);
    for (const [index, href] of links.entries()) {
      const target = container.querySelector(href.slice(href.indexOf('#')))!;
      expect(target).toHaveTextContent(translate(featuredProjects[index].titleKey));
      expect(target).toHaveTextContent(
        translate(`rising-status-${featuredProjects[index].status}`)
      );
    }
  });

  it('distinguishes an appropriation and company claims from actual city spending', () => {
    const { container } = render(<ProjectLedger />);
    const airport = within(container.querySelector('#project-mati-airport') as HTMLElement);
    expect(airport.getByText('FY2026 national appropriation')).toBeInTheDocument();
    expect(airport.getByText('₱700,000,000.00')).toBeInTheDocument();
    const details = container.querySelector('#project-mati-airport details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    fireEvent.click(airport.getByText('Details and sources'));
    expect(details.open).toBe(true);
    expect(airport.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      expect.stringContaining('GAA2026/VolumeIB/DOTR/A.pdf#page=13')
    );
    fireEvent.click(airport.getByText('Details and sources'));
    expect(details.open).toBe(false);
    const water = within(container.querySelector('#project-macambol-water') as HTMLElement);
    expect(container.querySelector('#project-macambol-water')).toHaveTextContent(
      'Company-funded · SDMP'
    );
    expect(water.getByText('Completion reported by company')).toBeInTheDocument();
    expect(screen.queryByText('Fully Operational')).not.toBeInTheDocument();
    expect(screen.queryByText('Under Construction')).not.toBeInTheDocument();
  });

  it('narrows the ledger by search and filters, and can clear them', () => {
    const { container } = render(<ProjectLedger />);
    const rows = () => container.querySelectorAll('#project-ledger > li');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'fish port' } });
    expect(rows()).toHaveLength(2);
    fireEvent.change(screen.getByLabelText('Funded by'), { target: { value: 'private' } });
    expect(container.querySelector('#project-ledger')).toBeNull();
    expect(screen.getByText(en['projects-no-match'])).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(rows()).toHaveLength(risingProjects.length);
    fireEvent.change(screen.getByLabelText('Sort order'), { target: { value: 'amount-high' } });
    expect(rows()[0]).toHaveAttribute('id', 'project-fish-port-coastal-access');
  });

  it('keeps procurement highlights consistent with their source records', () => {
    for (const project of risingProjects.filter((p) => p.amountKind === 'abc')) {
      const notice = procurementNotices.find((p) => project.id === `notice-${p.reference}`)!;
      expect(project.amount).toBe(notice.abc);
      expect(project.sourceDate).toBe(notice.updatedOn ?? notice.publishedOn);
      expect(project.sources[0].url).toBe(notice.sourceUrl);
      expect(project.status).toBe('awarded');
      expect(notice.completionPercent).toBeNull();
    }
  });

  it('provides dates, unique destinations, official source links and all three translations', () => {
    expect(new Set(risingProjects.map(projectAnchor)).size).toBe(risingProjects.length);
    for (const project of risingProjects) {
      expect(project.sourceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(project.sources.length).toBeGreaterThan(0);
      for (const source of project.sources)
        expect(new URL(source.url).hostname).toMatch(/\.gov\.ph$/);
      for (const locale of [en, ceb]) {
        for (const key of [
          project.titleKey,
          project.detailKey,
          `rising-status-${project.status}`,
          `rising-scope-${project.scope}`,
          `rising-amount-${project.amountKind}`,
        ]) {
          expect((locale as Record<string, string>)[key]).toBeTruthy();
        }
      }
    }
    for (const key of Object.keys(en).filter((key) => key.startsWith('rising-'))) {
      for (const locale of [ceb]) expect(locale).toHaveProperty(key);
    }
  });
});
