import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { FilterPanel, FilterSelect, Pager, SearchField, StatRow } from '@/components/primitives';
import { pesoCompact, pesoFull } from '@/lib/dpwhData';
import { formatChangeDate } from '@/lib/changelog';
import { awardedReports, awardedWorks, type AwardedWork } from '@/lib/awardedWorks';

const PAGE_SIZE = 10;
type Sort = 'newest' | 'oldest' | 'bid-high' | 'bid-low';

const bid = (w: AwardedWork) => w.bidAmount ?? -1;
const sorters: Record<Sort, (a: AwardedWork, b: AwardedWork) => number> = {
  newest: (a, b) => b.biddingDate.localeCompare(a.biddingDate) || bid(b) - bid(a),
  oldest: (a, b) => a.biddingDate.localeCompare(b.biddingDate) || bid(b) - bid(a),
  'bid-high': (a, b) => bid(b) - bid(a),
  'bid-low': (a, b) => bid(a) - bid(b),
};

const unique = (values: string[]) => [...new Set(values)];
const searchText = (w: AwardedWork) =>
  `${w.name} ${w.location} ${w.winningBidder} ${w.reference} ${w.period}`.toLowerCase();
const barangayOptions = unique(awardedWorks.flatMap((w) => w.barangayNames)).sort();
const yearOptions = unique(awardedWorks.map((w) => w.biddingDate.slice(0, 4)))
  .sort()
  .reverse();
const reportsRead = awardedReports.filter((r) => r.status === 'read').length;
// Both totals cover the same works: those whose winning bid reads as a number.
const priced = awardedWorks.filter((w) => w.bidAmount !== null);
const totalBids = priced.reduce((sum, w) => sum + (w.bidAmount ?? 0), 0);
const totalAbc = priced.reduce((sum, w) => sum + (w.abc ?? 0), 0);

// The City's awarded civil works as a searchable table, in the same pattern as the
// procurement notices: summary figures, filters, a table on wide screens and stacked
// records on phones, pages of ten. Every row links the City's own quarterly report.
export function AwardedWorksTable() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [barangay, setBarangay] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const [page, setPage] = useState(1);
  const resultsTop = useRef<HTMLHeadingElement>(null);
  // A new page starts at the top of the results, not at the pager.
  const goToPage = (n: number) => {
    setPage(n);
    resultsTop.current?.scrollIntoView?.({ block: 'start' });
  };

  const filtersOn = Boolean(query || barangay || year);
  const reset = () => {
    setQuery('');
    setBarangay('');
    setYear('');
    setPage(1);
  };
  // Any filter change returns to the first page.
  const on =
    <V,>(set: (v: V) => void) =>
    (v: V) => {
      set(v);
      setPage(1);
    };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return awardedWorks
      .filter(
        (w) =>
          (!barangay || w.barangayNames.includes(barangay)) &&
          (!year || w.biddingDate.startsWith(year)) &&
          (!q || searchText(w).includes(q))
      )
      .sort(sorters[sort]);
  }, [query, barangay, year, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;

  const date = (iso: string) => (
    <time dateTime={iso}>{formatChangeDate(iso, language, 'medium')}</time>
  );
  const winning = (w: AwardedWork) =>
    w.bidAmount !== null ? (
      pesoFull(w.bidAmount)
    ) : (
      <span className="font-normal text-feel-text">
        {t('works-bid-as-printed', { value: w.bidAmountAsPrinted ?? '' })}
      </span>
    );
  const where = (w: AwardedWork) =>
    w.barangayNames.length ? w.barangayNames.join(', ') : t('works-citywide');
  const source = (w: AwardedWork) => (
    <a
      href={w.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('works-open-report', { period: w.period, title: w.name })}
      className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap text-royal hover:underline"
    >
      {t('works-report')}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );

  return (
    <>
      <StatRow
        className="mt-8"
        items={[
          {
            label: t('works-stat-count'),
            value: awardedWorks.length,
            caption: t('works-stat-count-caption', {
              read: reportsRead,
              total: awardedReports.length,
            }),
          },
          {
            label: t('works-stat-bids'),
            value: pesoCompact(totalBids),
            caption: t('works-stat-bids-caption', {
              abc: pesoCompact(totalAbc),
              count: priced.length,
            }),
          },
          {
            label: t('works-stat-barangays'),
            value: barangayOptions.length,
            caption: t('works-stat-barangays-caption'),
          },
        ]}
      />

      <FilterPanel
        className="mt-8"
        title={t('works-filter')}
        action={
          filtersOn ? (
            <button
              type="button"
              onClick={reset}
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
          placeholder={t('works-search')}
          aria-label={t('works-search')}
          aria-controls="awarded-works-list"
        />
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterSelect
            id="works-barangay"
            label={t('works-filter-barangay')}
            value={barangay}
            onChange={on(setBarangay)}
            options={[
              { value: '', label: t('works-all-barangays') },
              ...barangayOptions.map((b) => ({ value: b, label: b })),
            ]}
          />
          <FilterSelect
            id="works-year"
            label={t('works-filter-year')}
            value={year}
            onChange={on(setYear)}
            options={[
              { value: '', label: t('projects-all-years') },
              ...yearOptions.map((y) => ({ value: y, label: y })),
            ]}
          />
          <FilterSelect
            id="works-sort"
            label={t('projects-sort')}
            value={sort}
            onChange={on(setSort)}
            options={(Object.keys(sorters) as Sort[]).map((s) => ({
              value: s,
              label: t(`works-sort-${s}`),
            }))}
          />
        </div>
      </FilterPanel>

      <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h3 ref={resultsTop} className="scroll-mt-32 text-xl font-bold text-heading">
          {t('works-count', { count: filtered.length })}
        </h3>
        <p className="text-sm text-ink-muted" aria-live="polite">
          {t('projects-showing-range', {
            from,
            to: from ? from + shown.length - 1 : 0,
            total: filtered.length,
          })}
        </p>
      </div>

      <div id="awarded-works-list">
        {shown.length === 0 ? (
          <p className="mt-4 border border-line bg-white px-6 py-10 text-center text-sm text-ink-muted">
            {t('projects-no-match')}
          </p>
        ) : (
          <>
            {/* Wide screens: the table. */}
            <div className="mt-4 hidden border border-line bg-white lg:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{t('works-title')}</caption>
                <thead>
                  <tr className="border-b border-line bg-surface-subtle text-xs font-semibold text-ink-soft">
                    <th scope="col" className="w-[32%] px-4 py-3">
                      {t('works-col-project')}
                    </th>
                    <th scope="col" className="w-[12%] px-4 py-3">
                      {t('works-col-barangay')}
                    </th>
                    <th scope="col" className="w-[10%] px-4 py-3">
                      {t('works-col-date')}
                    </th>
                    <th scope="col" className="w-[12%] px-4 py-3 text-right">
                      <abbr title={t('trans-abc')} className="no-underline">
                        ABC
                      </abbr>
                    </th>
                    <th scope="col" className="w-[12%] px-4 py-3 text-right">
                      {t('works-col-bid')}
                    </th>
                    <th scope="col" className="w-[14%] px-4 py-3">
                      {t('works-col-contractor')}
                    </th>
                    <th scope="col" className="w-[8%] px-4 py-3 text-right">
                      {t('projects-col-source')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm">
                  {shown.map((w) => (
                    <tr
                      key={w.id}
                      className="align-top transition-colors hover:bg-surface-subtle/60"
                    >
                      <td className="px-4 py-3">
                        <span className="font-semibold text-heading">{w.name}</span>
                        <span className="mt-0.5 block font-mono text-[0.6875rem] text-ink-faint">
                          {t('works-ref', { reference: w.reference, period: w.period })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-soft">{where(w)}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap text-ink-soft">
                        {date(w.biddingDate)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap text-ink-soft tabular-nums">
                        {w.abc !== null ? pesoFull(w.abc) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap text-heading tabular-nums">
                        {winning(w)}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-soft">
                        {w.winningBidder}
                        {w.bidderAddress ? (
                          <span className="block text-ink-faint">{w.bidderAddress}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right">{source(w)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phones and tablets: one stacked record per work. */}
            <ol className="mt-4 divide-y divide-line border border-line bg-white lg:hidden">
              {shown.map((w) => (
                <li key={w.id} className="space-y-3 p-4 sm:p-5">
                  <div>
                    <p className="leading-snug font-bold text-heading">{w.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {where(w)} · {date(w.biddingDate)}
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="font-medium text-ink-muted">{t('trans-abc')}</dt>
                      <dd className="mt-0.5 font-medium text-heading tabular-nums">
                        {w.abc !== null ? pesoFull(w.abc) : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-ink-muted">{t('works-col-bid')}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-heading tabular-nums">
                        {winning(w)}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-medium text-ink-muted">{t('works-col-contractor')}</dt>
                      <dd className="mt-0.5 font-medium text-heading">
                        {w.winningBidder}
                        {w.bidderAddress ? ` · ${w.bidderAddress}` : ''}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs">
                    <span className="font-mono text-ink-faint">
                      {t('works-ref', { reference: w.reference, period: w.period })}
                    </span>
                    {source(w)}
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <Pager page={page} pageCount={pageCount} onPage={goToPage} label={t('works-pages')} />

      <p className="mt-6 max-w-3xl text-xs leading-5 text-ink-muted">{t('works-footnote')}</p>
    </>
  );
}
