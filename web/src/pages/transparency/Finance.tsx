import type { ReactNode } from 'react';
import type { ChartOptions } from 'chart.js';
import { ClientOnly } from 'vite-react-ssg';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArrowRight, ArrowUpRight, Coins } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { useLanguage } from '@/hooks/useLanguage';
import { Band, PageHeader } from '@/components/primitives';
import {
  annualFinancials as q,
  currentYear as cy,
  financialOutlook,
  fiscalYears,
  pctOf,
  peso,
  specialFunds,
} from '@/lib/budgetData';
import { CHART_COLORS, CHART_GRID, chartFont, chartMonoFont } from '@/lib/charts';

const CARD = 'min-w-0 border border-line bg-white';
const FIRST = fiscalYears[0].year;
const LAST = fiscalYears[fiscalYears.length - 1].year;

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { font: chartFont, padding: 16 } },
    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${peso(ctx.parsed)}` } },
  },
  cutout: '58%',
};

const trendOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { font: chartFont, padding: 16 } },
    tooltip: {
      callbacks: { label: (c) => `${c.dataset.label}: ${peso(c.parsed.y ?? 0)}` },
    },
  },
  scales: {
    x: { ticks: { font: chartMonoFont }, grid: { display: false } },
    y: {
      ticks: { font: chartMonoFont, callback: (v) => `₱${Number(v).toLocaleString('en-PH')}M` },
      grid: { color: CHART_GRID },
    },
  },
};

const ChartFallback = () => (
  <div className="h-full animate-pulse bg-royal-tint" aria-hidden="true" />
);

function MetricCard({
  value,
  label,
  meta,
}: {
  value: ReactNode;
  label: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className={`${CARD} border-t-[3px] border-t-royal p-4 sm:p-5`}>
      <span className="block font-display text-[clamp(1rem,4.5vw,1.875rem)] font-extrabold tracking-[-0.02em] text-royal tabular-nums">
        {value}
      </span>
      <span className="mt-0.5 block text-sm font-semibold text-heading">{label}</span>
      {meta && <span className="mt-1 block font-mono text-[0.6875rem] text-ink-muted">{meta}</span>}
    </div>
  );
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-start gap-1 font-semibold text-royal hover:underline"
    >
      <span>{children}</span>
      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

function Meter({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  const width = Math.max(0, Math.min(pct, 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-[0.8125rem]">
        <span className="text-heading">{label}</span>
        <span className="font-mono text-[0.75rem] text-ink-muted tabular-nums">{value}</span>
      </div>
      <div
        className="h-2.5 overflow-hidden bg-line"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${label}: ${value}`}
      >
        <div className="h-full" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// City finances, after BetterSanFernando's /transparency/finance: five reported years
// side by side, the latest year in detail, the current year to date against the City's
// budget, the special funds, the planning outlook, and the catalog of official reports
// every figure comes from. Each year keeps its own source edition.
export default function Finance() {
  const { t } = useLanguage();

  const localPct = Math.round((q.receipts.local / q.receipts.total) * 100);
  const externalPct = Math.round((q.receipts.external / q.receipts.total) * 100);
  const nonIncomePct = 100 - localPct - externalPct;

  const trendData = {
    labels: fiscalYears.map((y) => y.period),
    datasets: [
      {
        label: t('finance-receipts'),
        data: fiscalYears.map((y) => y.receipts.total),
        backgroundColor: CHART_COLORS[0],
      },
      {
        label: t('finance-expenditures'),
        data: fiscalYears.map((y) => y.expenditures.total),
        backgroundColor: CHART_COLORS[2],
      },
    ],
  };

  const incomeData = {
    labels: [t('budget-local-sources'), t('budget-external-sources'), t('trans-non-income')],
    datasets: [
      {
        data: [q.receipts.local, q.receipts.external, q.receipts.nonIncome],
        backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2]],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const expenditureRows = [
    { label: t('budget-general-public-services'), amount: q.expenditures.gps, color: '#2b62ee' },
    { label: t('finance-social-excl-education'), amount: q.expenditures.social, color: '#06a77d' },
    { label: t('budget-economic-services'), amount: q.expenditures.economic, color: '#f77f00' },
    { label: t('finance-education-sef'), amount: q.expenditures.sef ?? 0, color: '#b45b16' },
    { label: t('trans-debt-operating'), amount: q.expenditures.debt, color: '#e01b24' },
    { label: t('trans-non-operating'), amount: q.expenditures.nonOperating, color: '#7357b6' },
  ];

  type Year = (typeof fiscalYears)[number];
  const summaryRows: { label: string; value: (y: Year) => number; strong?: boolean }[] = [
    { label: t('trans-beginning-cash'), value: (y) => y.beginningCashBalance },
    { label: t('budget-local-sources'), value: (y) => y.receipts.local },
    { label: t('budget-external-sources'), value: (y) => y.receipts.external },
    { label: t('finance-allotment'), value: (y) => y.receipts.nta },
    { label: t('trans-non-income'), value: (y) => y.receipts.nonIncome },
    { label: t('trans-total-receipts'), value: (y) => y.receipts.total, strong: true },
    { label: t('budget-total-expenditures'), value: (y) => y.expenditures.total, strong: true },
    { label: t('trans-cash-available'), value: (y) => y.fundCashAvailable },
    { label: t('trans-prior-payables'), value: (y) => y.priorYearPayables },
    { label: t('trans-continuing'), value: (y) => y.continuingAppropriation },
    { label: t('trans-ending-cash'), value: (y) => y.endingCashBalance, strong: true },
  ];

  const sf = specialFunds;
  const cyOperating = cy.expenditures.total - cy.expenditures.nonOperating;
  const progressRows = [
    {
      label: t('finance-ytd-local'),
      actual: cy.receipts.local,
      target: cy.budget.localSourcesTarget,
      kind: 'target',
    },
    {
      label: t('finance-ytd-nta'),
      actual: cy.receipts.nta,
      target: cy.budget.ntaAllocation,
      kind: 'allocation',
    },
    {
      label: t('finance-ytd-operating'),
      actual: cyOperating,
      target: cy.budget.currentOperating,
      kind: 'appropriation',
    },
    {
      label: t('finance-ytd-capital'),
      actual: cy.budget.actualCapitalOutlay,
      target: cy.budget.capitalOutlay,
      kind: 'appropriation',
    },
    {
      label: t('finance-ytd-principal'),
      actual: cy.budget.actualDebtPrincipal,
      target: cy.budget.debtPrincipal,
      kind: 'appropriation',
    },
  ];

  // pages: printed page range of a DBM table; a workbook or portal file has none.
  const catalog: {
    key: string;
    period: string;
    kind: string;
    title: string;
    href: string;
    pages?: number[];
    checkedOn: string;
  }[] = [
    {
      key: 'ytd',
      period: cy.period,
      kind: t('finance-ytd-kind'),
      title: cy.source.title,
      href: cy.source.url,
      checkedOn: cy.source.checkedOn,
    },
    {
      key: 'budget-2026',
      period: 'FY2026',
      kind: t('finance-budget-kind'),
      title: cy.budget.source.title,
      href: cy.budget.source.url,
      checkedOn: cy.budget.source.checkedOn,
    },
    {
      key: 'df-2026',
      period: sf.developmentFund.period,
      kind: t('finance-funds-kind'),
      title: sf.developmentFund.source.title,
      href: sf.developmentFund.source.url,
      checkedOn: sf.developmentFund.source.checkedOn,
    },
    {
      key: 'ldrrmf-2025',
      period: sf.ldrrmf.period,
      kind: t('finance-funds-kind'),
      title: sf.ldrrmf.source.title,
      href: sf.ldrrmf.source.url,
      checkedOn: sf.ldrrmf.source.checkedOn,
    },
    ...[...fiscalYears].reverse().flatMap((y) => [
      {
        key: String(y.year),
        period: y.period,
        kind: t('finance-reported'),
        title: y.source.title,
        href: `${y.source.url}#page=3`,
        pages: y.source.pages,
        checkedOn: y.source.checkedOn,
      },
      ...('crossCheck' in y && y.crossCheck
        ? [
            {
              key: `${y.year}-crosscheck`,
              period: y.period,
              kind: t('finance-crosscheck-kind'),
              title: y.crossCheck.title,
              href: y.crossCheck.url,
              checkedOn: y.crossCheck.checkedOn,
            },
          ]
        : []),
    ]),
    ...financialOutlook.map((o) => ({
      key: `outlook-${o.year}`,
      period: `FY${o.year}`,
      kind: t('trans-planning'),
      title: o.source.label,
      href: `${o.source.url}#page=3`,
      pages: o.source.pages,
      checkedOn: q.source.checkedOn,
    })),
  ];

  return (
    <>
      <Seo
        title={t('finance-page-name')}
        description={`City of Mati receipts and expenditures for FY${FIRST}–FY${LAST}, the latest year in detail and the 2026–2027 outlook, from DBM's published tables.`}
        canonicalPath="/transparency/finance"
      />

      <PageHeader
        badge={
          <>
            <Coins className="size-4" aria-hidden="true" />
            {t('finance-eyebrow')}
          </>
        }
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-transparency'), to: '/transparency' },
          { label: t('finance-page-name') },
        ]}
        title={t('finance-page-name')}
        description={t('finance-lede', { from: FIRST, to: LAST })}
        note={t('finance-note')}
        sidePanel={
          <div className="border border-line bg-surface-subtle p-6">
            <div className="font-mono text-[0.625rem] tracking-[0.08em] text-ink-muted uppercase">
              {t('trans-total-receipts')} · {q.period}
            </div>
            <div className="mt-1 font-display text-4xl leading-none font-extrabold tracking-[-0.03em] text-royal tabular-nums sm:text-5xl">
              {peso(q.receipts.total)}
            </div>
            <div
              className="mt-4 flex h-2.5 overflow-hidden"
              role="img"
              aria-label={`${t('trans-receipt-sources')}: ${localPct}% / ${externalPct}% / ${nonIncomePct}%`}
            >
              <div style={{ width: `${localPct}%`, backgroundColor: '#7aa5ff' }} />
              <div style={{ width: `${externalPct}%`, backgroundColor: '#2b62ee' }} />
              <div style={{ width: `${nonIncomePct}%`, backgroundColor: '#06a77d' }} />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.625rem] text-ink-muted">
              <span>
                {t('budget-local-sources')} {localPct}%
              </span>
              <span>
                {t('budget-external-sources')} {externalPct}%
              </span>
              <span>
                {t('trans-non-income')} {nonIncomePct}%
              </span>
            </div>
          </div>
        }
      />

      <Band
        id="trend"
        eyebrow={t('finance-trend-eyebrow')}
        title={t('finance-trend-title', { from: FIRST, to: LAST })}
        lede={t('finance-trend-lede')}
      >
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            value={peso(q.receipts.total)}
            label={t('trans-total-receipts')}
            meta={q.period}
          />
          <MetricCard
            value={peso(q.expenditures.total)}
            label={t('budget-total-expenditures')}
            meta={q.period}
          />
          <MetricCard value={peso(q.receipts.nta)} label={t('trans-nta')} meta={q.period} />
          <MetricCard
            value={peso(q.endingCashBalance)}
            label={t('trans-ending-cash')}
            meta={q.period}
          />
        </div>

        <div
          className={`${CARD} mt-6 h-80 p-4 sm:p-5`}
          role="img"
          aria-label={t('finance-trend-title', { from: FIRST, to: LAST })}
        >
          <ClientOnly fallback={<ChartFallback />}>
            {() => <Bar data={trendData} options={trendOptions} />}
          </ClientOnly>
        </div>

        <h3 className="mt-10 text-lg font-bold text-heading">{t('finance-summary-title')}</h3>
        <div
          className={`${CARD} mt-3 overflow-x-auto`}
          role="region"
          aria-label={t('finance-summary-title')}
          tabIndex={0}
        >
          <table className="w-full border-collapse text-left text-sm">
            <caption className="px-4 py-3 text-left text-ink-muted">{t('trans-units')}</caption>
            <thead>
              <tr className="bg-surface-subtle text-heading">
                <th scope="col" className="px-4 py-2.5">
                  {t('budget-metric')}
                </th>
                {fiscalYears.map((y) => (
                  <th key={y.year} scope="col" className="px-4 py-2.5 text-right whitespace-nowrap">
                    {y.period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th
                    scope="row"
                    className={`min-w-56 px-4 py-2.5 ${row.strong ? 'font-semibold text-heading' : 'font-normal text-ink-soft'}`}
                  >
                    {row.label}
                  </th>
                  {fiscalYears.map((y) => (
                    <td
                      key={y.year}
                      className={`px-4 py-2.5 text-right whitespace-nowrap tabular-nums ${row.strong ? 'font-semibold text-heading' : 'text-ink-soft'}`}
                    >
                      {peso(row.value(y))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">
          {t('finance-allotment-note')}
        </p>
      </Band>

      <Band
        id="latest"
        eyebrow={t('finance-latest-eyebrow')}
        title={`${t('trans-receipt-sources')} & ${t('budget-expenditure-allocation')} (${q.period})`}
      >
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className={`${CARD} p-5`}>
            <span className="mb-3 block text-sm font-semibold text-heading">
              {t('trans-receipt-sources')}
            </span>
            <div
              className="relative h-64 min-w-0"
              role="img"
              aria-label={`${t('trans-receipt-sources')}, ${q.period}`}
            >
              <ClientOnly fallback={<ChartFallback />}>
                {() => <Doughnut data={incomeData} options={doughnutOptions} />}
              </ClientOnly>
            </div>
          </div>
          <div className={`${CARD} p-5`}>
            <span className="mb-4 block text-sm font-semibold text-heading">
              {t('budget-expenditure-allocation')}
            </span>
            <div className="grid gap-3.5">
              {expenditureRows.map((row) => (
                <Meter
                  key={row.label}
                  label={row.label}
                  value={peso(row.amount)}
                  pct={(row.amount / q.expenditures.total) * 100}
                  color={row.color}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-muted">{t('trans-finance-note')}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">{t('trans-cash-note')}</p>
        {'crossCheck' in q && q.crossCheck ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
            {t('finance-crosscheck-note')}{' '}
            <SourceLink href={q.crossCheck.url}>{q.crossCheck.label}</SourceLink>
          </p>
        ) : null}
      </Band>

      <Band
        id="year-to-date"
        eyebrow={t('finance-ytd-eyebrow')}
        title={t('finance-ytd-title')}
        lede={t('finance-ytd-lede')}
      >
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <MetricCard
            value={peso(cy.receipts.total)}
            label={t('trans-total-receipts')}
            meta={cy.period}
          />
          <MetricCard
            value={peso(cy.expenditures.total)}
            label={t('budget-total-expenditures')}
            meta={cy.period}
          />
          <MetricCard
            value={peso(cy.endingCashBalance)}
            label={t('trans-ending-cash')}
            meta={t('finance-ytd-as-of')}
          />
        </div>

        <div className={`${CARD} mt-6 p-5`}>
          <span className="mb-1 block text-sm font-semibold text-heading">
            {t('finance-ytd-progress-title')}
          </span>
          <span className="mb-4 block text-xs text-ink-muted">
            {t('finance-ytd-progress-help')}
          </span>
          <div className="grid gap-4">
            {progressRows.map((row) => (
              <Meter
                key={row.label}
                label={row.label}
                value={t(`finance-ytd-of-${row.kind}`, {
                  actual: peso(row.actual),
                  target: peso(row.target),
                  pct: pctOf(row.actual, row.target),
                })}
                pct={pctOf(row.actual, row.target)}
                color={CHART_COLORS[0]}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 max-w-3xl space-y-2 text-sm leading-6 text-ink-muted">
          <p>{t('finance-ytd-note')}</p>
          <p className="flex flex-col gap-1">
            <SourceLink href={cy.source.url}>{cy.source.label}</SourceLink>
            <SourceLink href={cy.budget.source.url}>{cy.budget.source.label}</SourceLink>
          </p>
        </div>
      </Band>

      <Band
        id="special-funds"
        eyebrow={t('finance-funds-eyebrow')}
        title={t('finance-funds-title')}
        lede={t('finance-funds-lede')}
      >
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className={`${CARD} p-5`}>
            <h3 className="text-lg font-bold text-heading">{t('finance-funds-df-title')}</h3>
            <p className="mt-1 text-sm leading-6 text-ink-muted">{t('finance-funds-df-desc')}</p>
            <dl className="my-4 space-y-3 text-sm">
              {[
                [t('finance-funds-appropriated'), peso(sf.developmentFund.appropriation)],
                [
                  t('finance-funds-obligated', { period: sf.developmentFund.period }),
                  `${peso(sf.developmentFund.obligated)} (${pctOf(sf.developmentFund.obligated, sf.developmentFund.appropriation)}%)`,
                ],
                [t('finance-funds-df-loan'), peso(sf.developmentFund.loanAmortization.obligated)],
                [
                  t('finance-funds-df-projects'),
                  t('finance-funds-df-projects-value', {
                    none: sf.developmentFund.projectsWithoutObligation,
                    total: sf.developmentFund.projects,
                  }),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-wrap justify-between gap-2 border-b border-line pb-2"
                >
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="font-semibold text-heading tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-5 text-ink-muted">{t('finance-funds-df-note')}</p>
            <p className="mt-3 text-sm">
              <SourceLink href={sf.developmentFund.source.url}>
                {sf.developmentFund.source.label}
              </SourceLink>
            </p>
          </article>

          <article className={`${CARD} p-5`}>
            <h3 className="text-lg font-bold text-heading">{t('finance-funds-drr-title')}</h3>
            <p className="mt-1 text-sm leading-6 text-ink-muted">{t('finance-funds-drr-desc')}</p>
            <div className="my-4 grid gap-4">
              <Meter
                label={t('finance-funds-drr-total')}
                value={t('finance-funds-spent-of', {
                  actual: peso(sf.ldrrmf.spent),
                  target: peso(sf.ldrrmf.appropriation),
                })}
                pct={pctOf(sf.ldrrmf.spent, sf.ldrrmf.appropriation)}
                color={CHART_COLORS[1]}
              />
              <Meter
                label={t('finance-funds-drr-mitigation')}
                value={t('finance-funds-spent-of', {
                  actual: peso(sf.ldrrmf.mitigation.spent),
                  target: peso(sf.ldrrmf.mitigation.appropriation),
                })}
                pct={pctOf(sf.ldrrmf.mitigation.spent, sf.ldrrmf.mitigation.appropriation)}
                color={CHART_COLORS[1]}
              />
              <Meter
                label={t('finance-funds-drr-qrf')}
                value={t('finance-funds-spent-of', {
                  actual: peso(sf.ldrrmf.quickResponse.spent),
                  target: peso(sf.ldrrmf.quickResponse.appropriation),
                })}
                pct={pctOf(sf.ldrrmf.quickResponse.spent, sf.ldrrmf.quickResponse.appropriation)}
                color={CHART_COLORS[1]}
              />
            </div>
            <p className="text-xs leading-5 text-ink-muted">{t('finance-funds-drr-note')}</p>
            <p className="mt-3 text-sm">
              <SourceLink href={sf.ldrrmf.source.url}>{sf.ldrrmf.source.label}</SourceLink>
            </p>
          </article>
        </div>
      </Band>

      <Band
        id="outlook"
        eyebrow={t('trans-planning')}
        title={t('trans-outlook-title')}
        lede={t('trans-outlook-note')}
      >
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {financialOutlook.map((record) => (
            <article key={record.year} className={`${CARD} p-5`}>
              <h3 className="text-lg font-bold text-heading">
                FY{record.year} · {t('trans-planning')}
              </h3>
              <dl className="my-4 space-y-3 text-sm">
                {[
                  [t('trans-total-receipts'), record.receipts],
                  [t('budget-total-expenditures'), record.expenditures],
                  [t('trans-nta'), record.nta],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-wrap justify-between gap-2 border-b border-line pb-2"
                  >
                    <dt className="text-ink-muted">{label}</dt>
                    <dd className="font-semibold text-heading tabular-nums">
                      {peso(Number(value))}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href={`${record.source.url}#page=3`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-royal hover:underline"
              >
                {record.source.label}
              </a>
            </article>
          ))}
        </div>
      </Band>

      <Band
        id="reports"
        eyebrow={t('finance-catalog-eyebrow')}
        title={t('finance-catalog-title')}
        lede={t('finance-catalog-lede')}
      >
        <div className={`${CARD} mt-6 overflow-x-auto`}>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface-subtle text-heading">
                {[
                  'finance-catalog-year',
                  'finance-catalog-kind',
                  'finance-catalog-report',
                  'finance-catalog-pages',
                  'finance-catalog-checked',
                ].map((k) => (
                  <th
                    key={k}
                    scope="col"
                    className="px-4 py-2.5 text-xs font-bold tracking-wider uppercase"
                  >
                    {t(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalog.map((r) => (
                <tr key={r.key} className="border-t border-line align-top">
                  <th
                    scope="row"
                    className="px-4 py-3 font-semibold whitespace-nowrap text-heading"
                  >
                    {r.period}
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{r.kind}</td>
                  <td className="min-w-72 px-4 py-3">
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-royal hover:underline"
                    >
                      <span>{r.title}</span>
                      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft tabular-nums">
                    {r.pages ? `${r.pages[0]}–${r.pages[1]}` : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft tabular-nums">
                    {r.checkedOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      <Band
        id="how-to-read"
        eyebrow={t('finance-read-eyebrow')}
        title={t('finance-read-title')}
        last
      >
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          {['source', 'editions', 'borrowing'].map((k) => (
            <div key={k} className="space-y-2">
              <h3 className="text-base font-bold text-heading">{t(`finance-read-${k}`)}</h3>
              <p className="text-sm leading-6 text-ink-soft">{t(`finance-read-${k}-desc`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-2 border-t border-line pt-4 text-sm leading-6 text-ink-muted">
          <p>{t('trans-audit-note')}</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <AppLink
              to="/transparency/projects"
              className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
            >
              {t('projects-page-name')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </AppLink>
            <AppLink
              to="/transparency/sources"
              className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
            >
              {t('sources-see-all')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </AppLink>
          </p>
        </div>
      </Band>
    </>
  );
}
