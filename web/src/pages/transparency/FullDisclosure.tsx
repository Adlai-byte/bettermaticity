import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Band,
  FilterPanel,
  FilterSelect,
  PageHeader,
  Pager,
  SearchField,
} from '@/components/primitives';
import { formatChangeDate } from '@/lib/changelog';
import {
  fdpCheckedOn,
  fdpDocumentTypes,
  fdpPortal,
  fdpRecords,
  recordQuarter,
  recordYear,
  type FdpRecord,
} from '@/lib/transparencyData';

const years = fdpRecords.map((r) => recordYear(r.period)).filter((y): y is number => y !== null);
const FIRST = Math.min(...years);
const LAST = Math.max(...years);
const typesFound = new Set(fdpRecords.map((r) => r.type)).size;
const portalYears = fdpRecords
  .filter((r) => r.source === 'dilg-fdp-portal')
  .map((r) => recordYear(r.period))
  .filter((y): y is number => y !== null);
const PORTAL_FROM = Math.min(...portalYears);
const ARCHIVE_TO = Math.max(
  ...fdpRecords
    .filter((r) => r.source === 'archive')
    .map((r) => recordYear(r.period))
    .filter((y): y is number => y !== null)
);
const yearOptions = [...new Set(years)].sort((a, b) => b - a).map(String);
const PAGE_SIZE = 20;

// Newest first: by year, then quarter (whole-year reports after Q4), then type.
const sorted = [...fdpRecords].sort(
  (a, b) =>
    (recordYear(b.period) ?? 0) - (recordYear(a.period) ?? 0) ||
    recordQuarter(b.period) - recordQuarter(a.period) ||
    a.type.localeCompare(b.type)
);

function RecordRow({ record }: { record: FdpRecord }) {
  const { t, language } = useLanguage();
  const link = 'inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline';
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
      <div className="min-w-0">
        <p className="font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-royal uppercase">
          {record.type}
        </p>
        <h4 className="mt-1 text-base font-bold text-heading">{record.title}</h4>
        <p className="mt-1 text-sm text-ink-soft">
          {record.source === 'archive'
            ? `${record.period} · ${t('fdp-pages', { count: record.pages })} · ${record.issuer}`
            : `${record.period} · ${t('fdp-posted-for', { period: record.postingPeriod })} · ${record.issuer}`}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          {record.source === 'archive'
            ? t('fdp-archived-on', { date: formatChangeDate(record.archivedOn, language) })
            : t('fdp-from-portal', { date: formatChangeDate(record.checkedOn, language) })}
        </p>
      </div>
      <div className="sm:text-right">
        {record.source === 'archive' ? (
          <a href={record.url} target="_blank" rel="noopener noreferrer" className={link}>
            {t('fdp-open-archived')}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        ) : record.status === 'available' ? (
          <a href={record.url} target="_blank" rel="noopener noreferrer" className={link}>
            {t('fdp-download')}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-xs font-medium text-feel-text">{t('fdp-unavailable')}</span>
        )}
      </div>
    </li>
  );
}

// Full Disclosure reports, after BetterSanFernando's /transparency/full-disclosure: what
// the 14 required reports are, a filterable list grouped by year, and how to read it.
// Records are the City's postings on the DILG portal, plus archived copies of older files.
export default function FullDisclosure() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const resultsTop = useRef<HTMLDivElement>(null);
  const goToPage = (n: number) => {
    setPage(n);
    resultsTop.current?.scrollIntoView?.({ block: 'start' });
  };
  // Any filter change returns to the first page.
  const on =
    <V,>(set: (v: V) => void) =>
    (v: V) => {
      set(v);
      setPage(1);
    };
  const filtersOn = Boolean(query || type || year);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (r) =>
        (!type || r.type === type) &&
        (!year || String(recordYear(r.period)) === year) &&
        (!q || `${r.type} ${r.title} ${r.period}`.toLowerCase().includes(q))
    );
  }, [query, type, year]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const groups = useMemo(() => {
    const byYear = new Map<string, FdpRecord[]>();
    for (const r of shown) {
      const y = recordYear(r.period);
      const key = y === null ? t('fdp-year-unstated') : String(y);
      byYear.set(key, [...(byYear.get(key) ?? []), r]);
    }
    // Newest year first; records with no printed year go last.
    const rank = (k: string) => (/^\d{4}$/.test(k) ? Number(k) : 0);
    return [...byYear.entries()].sort((a, b) => rank(b[0]) - rank(a[0]));
  }, [shown, t]);

  const countByType = (name: string) => fdpRecords.filter((r) => r.type === name).length;

  return (
    <>
      <Seo
        title={t('fdp-page-name')}
        description="Full Disclosure Policy reports of the City of Mati: budgets, fund utilization, procurement and cash flow reports, linked to the DILG portal or an archived copy."
        canonicalPath="/transparency/full-disclosure"
      />

      <PageHeader
        badge={
          <>
            <FileSpreadsheet className="size-4" aria-hidden="true" />
            {t('fdp-eyebrow')}
          </>
        }
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-transparency'), to: '/transparency' },
          { label: t('fdp-page-name') },
        ]}
        title={t('fdp-page-name')}
        description={t('fdp-lede')}
        meta={[
          t('fdp-count', { count: fdpRecords.length }),
          `${FIRST}–${LAST}`,
          t('fdp-types-found', { found: typesFound, total: fdpDocumentTypes.length }),
        ]}
        aside={{
          label: t('fdp-about-label'),
          title: t('fdp-about-title'),
          body: t('fdp-about-body', {
            portalFrom: PORTAL_FROM,
            archiveFrom: FIRST,
            archiveTo: ARCHIVE_TO,
          }),
          footer: (
            <a
              href={fdpPortal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-royal hover:underline"
            >
              {t('fdp-portal-link')}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          ),
        }}
      />

      <Band
        id="report-types"
        eyebrow={t('fdp-types-eyebrow')}
        title={t('fdp-types-title', { total: fdpDocumentTypes.length })}
        lede={t('fdp-types-lede')}
      >
        <ul className="mt-6 grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {fdpDocumentTypes.map((d) => {
            const n = countByType(d.name);
            return (
              <li key={d.name} className="border-r border-b border-line p-5">
                <h3 className="text-sm font-bold text-heading">{d.name}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-muted">{d.meaning}</p>
                <p className={`mt-2 font-mono text-xs ${n ? 'text-royal' : 'text-ink-faint'}`}>
                  {n ? t('fdp-in-archive', { count: n }) : t('fdp-none-yet')}
                </p>
              </li>
            );
          })}
        </ul>
      </Band>

      <Band id="archive" eyebrow={t('fdp-archive-eyebrow')} title={t('fdp-archive-title')}>
        <FilterPanel
          className="mt-6"
          title={t('fdp-filter-title')}
          action={
            filtersOn ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setType('');
                  setYear('');
                  setPage(1);
                }}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('projects-clear-filters')}
              </button>
            ) : null
          }
        >
          <SearchField
            value={query}
            onChange={(e) => on(setQuery)(e.target.value)}
            placeholder={t('fdp-search')}
            aria-label={t('fdp-search')}
            aria-controls="fdp-results"
          />
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FilterSelect
              id="fdp-type"
              label={t('fdp-filter-type')}
              value={type}
              onChange={on(setType)}
              options={[
                { value: '', label: t('fdp-all-types') },
                ...fdpDocumentTypes
                  .filter((d) => countByType(d.name) > 0)
                  .map((d) => ({ value: d.name, label: d.name })),
              ]}
            />
            <FilterSelect
              id="fdp-year"
              label={t('fdp-filter-year')}
              value={year}
              onChange={on(setYear)}
              options={[
                { value: '', label: t('fdp-all-years') },
                ...yearOptions.map((y) => ({ value: y, label: y })),
              ]}
            />
          </div>
        </FilterPanel>
        <div ref={resultsTop} className="scroll-mt-32">
          <p className="mt-4 text-sm text-ink-muted" aria-live="polite">
            {t('gov-directory-showing', { count: filtered.length, total: fdpRecords.length })}
          </p>
        </div>

        <div id="fdp-results">
          {groups.length === 0 ? (
            <p className="mt-8 text-sm text-ink-muted">{t('fdp-no-match')}</p>
          ) : (
            groups.map(([y, records]) => (
              <section key={y} className="mt-8" aria-labelledby={`fdp-${y}`}>
                <h3
                  id={`fdp-${y}`}
                  className="border-b-2 border-heading pb-2 text-xl font-bold text-heading"
                >
                  {y}
                </h3>
                <ul className="divide-y divide-line">
                  {records.map((r) => (
                    <RecordRow key={r.url} record={r} />
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
        <Pager page={page} pageCount={pageCount} onPage={goToPage} label={t('fdp-pages-label')} />
      </Band>

      <Band id="understanding" eyebrow={t('fdp-read-eyebrow')} title={t('fdp-read-title')}>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {['verification', 'coverage', 'archive'].map((k) => (
            <div key={k} className="space-y-2">
              <h3 className="text-base font-bold text-heading">{t(`fdp-read-${k}`)}</h3>
              <p className="text-sm leading-6 text-ink-soft">{t(`fdp-read-${k}-desc`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-line pt-4 text-sm text-ink-muted">
          {t('sources-checked')}: {formatChangeDate(fdpCheckedOn, language)}
        </p>
      </Band>

      <Band
        id="related"
        eyebrow={t('transparency-related-eyebrow')}
        title={t('transparency-related-title')}
        last
      >
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {[
            ['/transparency/finance', 'finance-page-name'],
            ['/transparency/documents', 'docs-page-name'],
            ['/transparency/sources', 'sources-page-name'],
            ['/transparency/methodology', 'method-page-name'],
          ].map(([to, key]) => (
            <li key={to}>
              <AppLink
                to={to}
                className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
              >
                {t(key)}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </AppLink>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
