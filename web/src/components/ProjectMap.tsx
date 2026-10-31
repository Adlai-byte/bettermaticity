import { useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppLink } from '@/components/AppLink';
import { Eyebrow, FilterSelect } from '@/components/primitives';
import { useLanguage } from '@/hooks/useLanguage';
import { pesoFull } from '@/lib/dpwhData';
import {
  DENSITY_BINS,
  attributedCount,
  barangayShapes,
  barangaysWithRecords,
  citywideCount,
  densityBin,
  mapViewBox,
  recordsByBarangay,
  totalCount,
  type MapRecord,
} from '@/lib/projectMap';

const FILL = ['fill-map-0', 'fill-map-1', 'fill-map-2', 'fill-royal', 'fill-navy'];
const SWATCH = ['bg-map-0', 'bg-map-1', 'bg-map-2', 'bg-royal', 'bg-navy'];
const byName = [...barangayShapes].sort((a, b) => a.name.localeCompare(b.name));
const countOf = (psgc: string) => recordsByBarangay.get(psgc)?.length ?? 0;

function Stat({ label, value, rule }: { label: string; value: number; rule?: boolean }) {
  return (
    <div className={cn(rule && 'border-l-2 border-heading pl-3')}>
      <p className="font-mono text-[0.625rem] font-medium tracking-[0.12em] text-ink-muted uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-extrabold text-heading tabular-nums">{value}</p>
    </div>
  );
}

function RecordItem({ record }: { record: MapRecord }) {
  const { t } = useLanguage();
  return (
    <li className="py-3">
      <p className="text-sm leading-snug font-semibold text-heading">
        {record.titleKey ? t(record.titleKey) : record.title}
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        {record.year}
        {record.amount !== null ? ` · ${t(record.amountKey)} ${pesoFull(record.amount)}` : ''}
      </p>
      <a
        href={record.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-start gap-1 text-xs font-semibold text-royal hover:underline"
      >
        <span>{record.sourceLabel}</span>
        <ArrowUpRight className="mt-px size-3 shrink-0" aria-hidden="true" />
      </a>
    </li>
  );
}

// Barangay map of published project records, after BetterSanFernando's "See Projects Across
// San Fernando": shading counts records whose own source names the barangay. The full map
// lets readers pick a barangay to list its records; the compact one (Home) links here.
// The map lies on its side (north to the left, see build-barangay-paths.mjs) so the long
// city fits a wide section; the notes sit under it and the panel runs alongside both.
export function ProjectMap({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState('');
  const [hovered, setHovered] = useState('');
  const shape = barangayShapes.find((s) => s.psgc === selected);
  const focus = barangayShapes.find((s) => s.psgc === (hovered || selected));
  const select = (psgc: string) => setSelected((cur) => (cur === psgc ? '' : psgc));

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:grid-rows-[auto_1fr]">
      <figure className="flex min-w-0 flex-col border border-line bg-surface-subtle p-4 sm:p-5 lg:col-start-1 lg:row-start-1">
        <div className="flex items-start justify-between gap-4">
          <p className="min-h-5 text-sm text-ink-soft" aria-live="polite">
            {focus
              ? t('map-focus', { name: focus.name, count: countOf(focus.psgc) })
              : t(compact ? 'map-hint-compact' : 'map-hint')}
          </p>
          <span
            className="inline-flex shrink-0 items-center gap-1 font-mono text-[0.6875rem] font-semibold text-ink-muted"
            title={t('map-north')}
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />N
            <span className="sr-only"> ({t('map-north')})</span>
          </span>
        </div>
        <svg
          viewBox={mapViewBox}
          className="mt-3 h-auto w-full"
          role="group"
          aria-label={t('map-svg-label')}
        >
          {barangayShapes.map((s) => {
            const n = countOf(s.psgc);
            const label = t('map-barangay-label', { name: s.name, count: n });
            return (
              <path
                key={s.psgc}
                d={s.d}
                data-psgc={s.psgc}
                className={cn(
                  FILL[densityBin(n)],
                  'stroke-white transition-opacity',
                  !compact &&
                    'cursor-pointer outline-none hover:opacity-80 focus-visible:opacity-70'
                )}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() => setHovered(s.psgc)}
                onMouseLeave={() => setHovered('')}
                {...(compact
                  ? {}
                  : {
                      role: 'button',
                      tabIndex: 0,
                      'aria-label': label,
                      'aria-pressed': selected === s.psgc,
                      onClick: () => select(s.psgc),
                      onFocus: () => setHovered(s.psgc),
                      onBlur: () => setHovered(''),
                      onKeyDown: (e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          select(s.psgc);
                        }
                      },
                    })}
              >
                <title>{label}</title>
              </path>
            );
          })}
          {shape ? (
            <path
              d={shape.d}
              className="pointer-events-none fill-none stroke-amber"
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>
        <figcaption className="mt-3 text-[0.6875rem] leading-5 text-ink-muted">
          {t('map-attribution')}
        </figcaption>
        <table className="sr-only">
          <caption>{t('map-table-caption')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('map-table-barangay')}</th>
              <th scope="col">{t('map-table-records')}</th>
            </tr>
          </thead>
          <tbody>
            {byName.map((s) => (
              <tr key={s.psgc}>
                <th scope="row">{s.name}</th>
                <td>{countOf(s.psgc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <aside
        className="min-w-0 border border-line bg-white p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        aria-live="polite"
      >
        {!compact ? (
          <div className="mb-5">
            <FilterSelect
              id="map-barangay"
              label={t('map-choose')}
              value={selected}
              onChange={setSelected}
              options={[
                { value: '', label: t('map-citywide') },
                ...byName.map((s) => ({
                  value: s.psgc,
                  label: `${s.name} (${countOf(s.psgc)})`,
                })),
              ]}
            />
          </div>
        ) : null}

        {shape ? (
          <div>
            <button
              type="button"
              onClick={() => setSelected('')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-royal hover:underline"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {t('map-back')}
            </button>
            <Eyebrow className="mt-4 block">{t('map-barangay-eyebrow')}</Eyebrow>
            <h3 className="mt-1 text-2xl font-bold text-heading">{shape.name}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {t('map-records', { count: countOf(shape.psgc) })}
            </p>
            {countOf(shape.psgc) ? (
              <ul className="mt-3 max-h-[20rem] divide-y divide-line overflow-y-auto border-t border-line">
                {recordsByBarangay.get(shape.psgc)!.map((r) => (
                  <RecordItem key={r.id} record={r} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-ink-soft">{t('map-none')}</p>
            )}
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              {t('map-citywide-note', { count: citywideCount })}
            </p>
          </div>
        ) : (
          <div>
            <Eyebrow>{t('map-overview-eyebrow')}</Eyebrow>
            <h3 className="mt-1 text-2xl font-bold text-heading">{t('map-overview-title')}</h3>
            <div className="mt-5 border-t border-line pt-5">
              <Stat label={t('map-total')} value={totalCount} />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Stat label={t('map-attributed')} value={attributedCount} rule />
                <Stat label={t('map-unassigned')} value={citywideCount} rule />
              </div>
              <p className="mt-3 text-xs leading-5 text-ink-muted">
                {t('map-equation', {
                  attributed: attributedCount,
                  barangays: barangaysWithRecords,
                  citywide: citywideCount,
                  total: totalCount,
                })}
              </p>
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <p className="font-mono text-xs font-semibold tracking-[0.12em] text-heading uppercase">
                {t('map-density')}
              </p>
              <div className="mt-3 grid grid-cols-5 gap-px" aria-hidden="true">
                {DENSITY_BINS.map((b, i) => (
                  <div key={b.label}>
                    <div className={cn('h-2', SWATCH[i])} />
                    <p className="mt-1 text-center font-mono text-[0.625rem] text-ink-muted">
                      {b.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{t('map-density-help')}</p>
            </div>
            {compact ? (
              <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5 text-sm">
                <AppLink
                  to="/transparency/projects#project-map"
                  className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
                >
                  {t('map-explore')}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </AppLink>
                <AppLink
                  to="/government/barangays"
                  className="inline-flex items-center gap-1 text-ink-muted hover:text-royal hover:underline"
                >
                  {t('map-browse-barangays')}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </AppLink>
              </div>
            ) : null}
          </div>
        )}
      </aside>

      <div className="min-w-0 border border-line bg-white p-5 lg:col-start-1 lg:row-start-2">
        <p className="font-mono text-xs font-semibold tracking-[0.12em] text-heading uppercase">
          {t('map-read-title')}
        </p>
        <div className="mt-2 grid gap-3 md:grid-cols-2 md:gap-6">
          <p className="text-xs leading-5 text-ink-soft">{t('map-read-1')}</p>
          <p className="text-xs leading-5 text-ink-soft">{t('map-read-2')}</p>
        </div>
      </div>
    </div>
  );
}
