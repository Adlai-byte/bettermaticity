import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, Check, Download, X } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { useLanguage } from '@/hooks/useLanguage';
import { Band, PageHeader, TextLink } from '@/components/primitives';
import { LOGO_COLORS, LOGO_VERSIONS, formatBytes, hexToRgb, type LogoFile } from '@/lib/logoKit';
import { cn } from '@/lib/utils';

const LOGO = '/assets/images/logo/better-mati-logo.svg';
const LOGO_WHITE = '/assets/images/logo/better-mati-logo-white.svg';
const MARK = '/assets/images/logo/better-mati-mark.svg';
const REPO_LICENSE = 'https://github.com/kaarlosasiang/bettermaticity/blob/main/LICENSE';
const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';
const EMAIL = 'volunteer@bettermati.org';

const monoLabel = 'font-mono text-[0.6875rem] font-medium tracking-[0.14em] uppercase';

// Numbered callouts on the full logo, as a share of its 240.3 x 75.3 viewBox.
const PARTS: { id: string; left: string; top: string }[] = [
  { id: 'dinosaur', left: '24%', top: '46%' },
  { id: 'sun', left: '35%', top: '11%' },
  { id: 'bay', left: '34%', top: '94%' },
  { id: 'name', left: '47.5%', top: '6%' },
];

const DOS = ['files', 'background', 'space', 'credit'] as const;

// Each "don't" is the real logo mistreated in the way the caption names.
const DONTS: { id: string; dark?: boolean; style?: CSSProperties; retype?: boolean }[] = [
  { id: 'stretch', style: { transform: 'scale(1.35, 0.8)' } },
  { id: 'recolor', style: { filter: 'hue-rotate(150deg) saturate(1.4)' } },
  { id: 'rotate', style: { transform: 'rotate(-14deg)' } },
  { id: 'background', dark: true },
  { id: 'effects', style: { filter: 'drop-shadow(4px 5px 2px rgb(0 0 0 / 0.45))' } },
  { id: 'retype', retype: true },
];

function Callout({ n, left, top }: { n: number; left: string; top: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ left, top }}
      className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-navy bg-white font-mono text-[0.6875rem] font-bold text-navy shadow-sm"
    >
      {n}
    </span>
  );
}

// The BetterMati logo: what the mark shows, every version with its downloads, the colors,
// clear space and minimum size, do's and don'ts, and the license the files are shared under.
export default function AboutLogo() {
  const { t } = useLanguage();

  const fileLabel = (f: LogoFile) => (f.square ? t('logo-file-square') : f.format);
  const fileDetail = (f: LogoFile) =>
    [f.width ? `${f.width} × ${f.height}` : null, formatBytes(f.bytes)].filter(Boolean).join(' · ');

  return (
    <>
      <Seo
        title={t('logo-title')}
        description="The BetterMati logo: what it shows, its colors, how to use it, and SVG and PNG files to download."
        canonicalPath="/about/logo"
      />

      <PageHeader
        eyebrow={t('logo-eyebrow')}
        title={t('logo-title')}
        description={t('logo-lede')}
        ledeTone="strong"
        note={t('logo-note')}
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-about'), to: '/about' },
          { label: t('logo-crumb') },
        ]}
        actions={
          <>
            <a
              href="#versions"
              className="inline-flex h-11 items-center gap-2 rounded-btn bg-royal px-5 text-sm font-semibold text-white transition-colors hover:bg-royal/90"
            >
              <Download className="size-4" aria-hidden="true" />
              {t('logo-cta-download')}
            </a>
            <a
              href="#usage"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
            >
              {t('logo-cta-usage')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </>
        }
        sidePanel={
          <figure className="grid grid-rows-[1fr_auto] border border-line">
            <div className="grid place-items-center bg-white px-8 py-12">
              <img
                src={LOGO}
                alt="BetterMati.org"
                width={240}
                height={75}
                className="h-auto w-full max-w-[17rem]"
              />
            </div>
            <div className="grid place-items-center bg-navy px-8 py-6">
              <img
                src={LOGO_WHITE}
                alt=""
                width={240}
                height={75}
                className="h-auto w-full max-w-[11rem]"
              />
            </div>
          </figure>
        }
      />

      {/* What the mark shows */}
      <Band
        id="mark"
        eyebrow={t('logo-mark-eyebrow')}
        title={t('logo-mark-title')}
        lede={t('logo-mark-lede')}
      >
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          <figure className="self-start border border-line bg-white px-6 py-12 sm:px-12 sm:py-16">
            <div className="relative mx-auto max-w-xl">
              <img
                src={LOGO}
                alt={t('logo-mark-figure')}
                width={240}
                height={75}
                className="h-auto w-full"
              />
              {PARTS.map((p, i) => (
                <Callout key={p.id} n={i + 1} left={p.left} top={p.top} />
              ))}
            </div>
          </figure>
          <div>
            <ol className="divide-y divide-line border-y border-line">
              {PARTS.map((p, i) => (
                <li key={p.id} className="flex gap-4 py-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-navy font-mono text-[0.6875rem] font-bold text-navy">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-bold text-heading">{t(`logo-part-${p.id}`)}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink-muted">
                      {t(`logo-part-${p.id}-desc`)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <TextLink to="/visit-mati/sleeping-dinosaur" className="mt-5">
              {t('logo-mark-visit')}
            </TextLink>
          </div>
        </div>
      </Band>

      {/* Versions, each with its files */}
      <Band
        id="versions"
        eyebrow={t('logo-versions-eyebrow')}
        title={t('logo-versions-title')}
        lede={t('logo-versions-lede')}
      >
        <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {LOGO_VERSIONS.map((v) => (
            <li
              key={v.id}
              className={cn('flex flex-col bg-white', v.id === 'icon' && 'md:col-span-2')}
            >
              <div
                className={cn(
                  'flex min-h-44 items-center justify-center gap-8 px-8 py-10',
                  v.background === 'dark' ? 'bg-navy' : 'bg-surface-subtle'
                )}
              >
                {v.previews.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className={cn(
                      'h-auto',
                      v.id === 'icon'
                        ? 'w-20 sm:w-24'
                        : v.id.startsWith('mark')
                          ? 'w-28'
                          : 'w-full max-w-[15rem]'
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-bold text-heading">{t(`logo-version-${v.id}`)}</h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-ink-muted">
                  {t(`logo-version-${v.id}-desc`)}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {v.files.map((f) => (
                    <li key={f.href}>
                      <a
                        href={f.href}
                        download
                        aria-label={t('logo-download-label', {
                          version: t(`logo-version-${v.id}`),
                          format: fileLabel(f),
                          detail: fileDetail(f),
                        })}
                        className="inline-flex h-9 items-center gap-2 rounded-btn border border-line bg-white px-3 text-xs font-semibold text-heading transition-colors hover:border-royal hover:text-royal"
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        {fileLabel(f)}
                        <span className="font-mono font-normal text-ink-faint">
                          {fileDetail(f)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      {/* Colors */}
      <Band
        id="colors"
        eyebrow={t('logo-colors-eyebrow')}
        title={t('logo-colors-title')}
        lede={t('logo-colors-lede')}
      >
        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {LOGO_COLORS.map((c) => (
            <li key={c.id} className="flex flex-col bg-white">
              <span
                aria-hidden="true"
                className="h-24 border-b border-line"
                style={{ backgroundColor: c.hex }}
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-heading">{t(`logo-color-${c.id}`)}</h3>
                <p className="mt-1 flex-1 text-xs leading-5 text-ink-muted">
                  {t(`logo-color-${c.id}-use`)}
                </p>
                <dl className="mt-3 space-y-0.5 font-mono text-[0.6875rem] text-ink-soft">
                  <div className="flex gap-2">
                    <dt className="w-8 text-ink-faint">HEX</dt>
                    <dd className="select-all">{c.hex}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-8 text-ink-faint">RGB</dt>
                    <dd className="select-all">{hexToRgb(c.hex)}</dd>
                  </div>
                  {c.token ? (
                    <div className="flex gap-2">
                      <dt className="w-8 text-ink-faint">CSS</dt>
                      <dd className="select-all">{c.token}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      {/* Clear space and minimum size */}
      <Band
        id="space"
        eyebrow={t('logo-space-eyebrow')}
        title={t('logo-space-title')}
        lede={t('logo-space-lede')}
      >
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border border-line bg-white p-5 md:p-6">
            <h3 className="font-bold text-heading">{t('logo-space-clear')}</h3>
            <p className="mt-1 text-sm leading-6 text-ink-muted">{t('logo-space-clear-desc')}</p>
            {/* The gap is the sun's width: 43% of the logo's height (h-16 → 28px, h-20 → 34px). */}
            <figure
              aria-label={t('logo-space-figure')}
              className="mt-6 grid place-items-center bg-surface-subtle px-4 py-8"
            >
              <div className="relative border border-dashed border-royal p-7 sm:p-[34px]">
                <img src={LOGO} alt="" width={240} height={75} className="h-16 w-auto sm:h-20" />
                {['top-0 left-0', 'right-0 bottom-0'].map((pos) => (
                  <span
                    key={pos}
                    aria-hidden="true"
                    className={cn(
                      'absolute grid size-7 place-items-center rounded-full bg-amber/35 font-mono text-xs text-navy sm:size-[34px]',
                      pos
                    )}
                  >
                    x
                  </span>
                ))}
              </div>
            </figure>
          </div>
          <div className="border border-line bg-white p-5 md:p-6">
            <h3 className="font-bold text-heading">{t('logo-space-min')}</h3>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              <div className="flex items-center gap-5 py-5">
                <dt className="grid w-28 shrink-0 justify-items-start gap-2">
                  <img src={LOGO} alt="" width={100} height={31} className="w-[100px]" />
                  <span className="font-mono text-[0.6875rem] font-medium text-royal">100 px</span>
                </dt>
                <dd className="text-sm leading-6 text-ink-muted">{t('logo-space-min-full')}</dd>
              </div>
              <div className="flex items-center gap-5 py-5">
                <dt className="grid w-28 shrink-0 justify-items-start gap-2">
                  <img src={MARK} alt="" width={24} height={17} className="w-6" />
                  <span className="font-mono text-[0.6875rem] font-medium text-royal">24 px</span>
                </dt>
                <dd className="text-sm leading-6 text-ink-muted">{t('logo-space-min-mark')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Band>

      {/* Do and don't */}
      <Band
        id="usage"
        eyebrow={t('logo-usage-eyebrow')}
        title={t('logo-usage-title')}
        lede={t('logo-usage-lede')}
      >
        <div className="mt-8 border border-line bg-white p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-heading uppercase">
            <Check className="size-4 text-royal" aria-hidden="true" />
            {t('logo-do-title')}
          </h3>
          <ul className="mt-3 grid gap-x-10 sm:grid-cols-2">
            {DOS.map((d) => (
              <li key={d} className="flex gap-3 border-b border-line py-2.5 text-sm text-ink">
                <span aria-hidden="true" className="text-ink-faint">
                  —
                </span>
                {t(`logo-do-${d}`)}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mt-10 flex items-center gap-2 text-sm font-bold text-heading uppercase">
          <X className="size-4 text-destructive" aria-hidden="true" />
          {t('logo-dont-title')}
        </h3>
        <ul className="mt-4 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {DONTS.map((d) => (
            <li key={d.id} className="flex flex-col bg-white">
              <div
                aria-hidden="true"
                className={cn(
                  'relative grid h-36 place-items-center overflow-hidden px-8',
                  d.dark ? 'bg-navy' : 'bg-surface-subtle'
                )}
              >
                {d.retype ? (
                  <span className="flex items-center gap-2">
                    <img src={MARK} alt="" width={56} height={41} className="w-14" />
                    <span className="font-serif text-2xl text-heading italic">Better Mati</span>
                  </span>
                ) : (
                  <img
                    src={LOGO}
                    alt=""
                    width={240}
                    height={75}
                    style={d.style}
                    className="h-auto w-full max-w-[11rem]"
                  />
                )}
                <span className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-destructive text-white">
                  <X className="size-3.5" />
                </span>
              </div>
              <p className="border-t border-line px-4 py-3 text-sm text-ink">
                {t(`logo-dont-${d.id}`)}
              </p>
            </li>
          ))}
        </ul>
      </Band>

      {/* License */}
      <Band id="license" eyebrow={t('logo-license-eyebrow')} title={t('logo-license-title')} last>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4 text-base leading-7 text-ink-soft">
            <p>{t('logo-license-cc')}</p>
            <div className="border-l-2 border-royal bg-surface-subtle px-4 py-3">
              <p className={`${monoLabel} text-royal`}>{t('logo-credit-label')}</p>
              <p className="mt-1 font-mono text-sm text-heading select-all">
                {t('logo-credit-text')}
              </p>
            </div>
            <p>{t('logo-license-requests')}</p>
            <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a
                href={CC_BY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
              >
                {t('logo-license-cc-link')}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only"> ({t('service-new-tab')})</span>
              </a>
              <a
                href={REPO_LICENSE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
              >
                {t('logo-license-repo-link')}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only"> ({t('service-new-tab')})</span>
              </a>
            </p>
          </div>
          <dl className="self-start divide-y divide-line border border-line bg-surface-subtle px-5 md:px-6">
            {['endorse', 'others'].map((k) => (
              <div key={k} className="py-4">
                <dt className="text-sm font-bold text-heading uppercase">
                  {t(`logo-license-${k}-title`)}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-ink-muted">{t(`logo-license-${k}`)}</dd>
              </div>
            ))}
            <div className="py-4">
              <dt className="text-sm font-bold text-heading uppercase">
                {t('logo-license-questions-title')}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-ink-muted">
                {t('logo-license-questions')}{' '}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-royal hover:underline">
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Band>
    </>
  );
}
