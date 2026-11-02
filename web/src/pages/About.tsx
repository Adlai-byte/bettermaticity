import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Info, Mail } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Container,
  Eyebrow,
  PageHeader,
  Section,
  SectionHead,
  TextLink,
} from '@/components/primitives';
import { services } from '@/lib/services';
import { departments } from '@/lib/govDirectory';
import { barangayCount } from '@/lib/statsData';
import { officials, ordinances, resolutions } from '@/lib/govData';
import { risingProjects } from '@/lib/risingProjects';

const REPO = 'https://github.com/kaarlosasiang/bettermaticity';

// The directories BetterMati organizes, in nav order.
const DIRECTORIES: { to: string; key: string; descKey: string }[] = [
  { to: '/services', key: 'nav-services', descKey: 'about-dir-services' },
  { to: '/government', key: 'nav-government', descKey: 'about-dir-government' },
  { to: '/legislative', key: 'gov-legislation-title', descKey: 'about-dir-legislation' },
  { to: '/transparency', key: 'nav-transparency', descKey: 'about-dir-transparency' },
  { to: '/statistics', key: 'nav-statistics', descKey: 'about-dir-statistics' },
  { to: '/visit-mati', key: 'nav-visit-mati', descKey: 'about-dir-visit' },
];

// Current published scope, each counted from the data the site actually ships.
const COVERAGE: { value: number; key: string }[] = [
  { value: services.length, key: 'about-count-services' },
  { value: departments.length, key: 'about-count-offices' },
  { value: barangayCount, key: 'about-count-barangays' },
  {
    value:
      (officials.mayor ? 1 : 0) +
      (officials.vice_mayor ? 1 : 0) +
      (officials.councilors?.length ?? 0),
    key: 'about-count-officials',
  },
  { value: resolutions.length + ordinances.length, key: 'about-count-legislative' },
  { value: risingProjects.length, key: 'about-count-projects' },
];

const SOURCES = ['services', 'funds', 'places', 'government', 'hotlines'] as const;
const STEPS = ['find', 'check', 'structure', 'publish'] as const;
const PRINCIPLES = ['source', 'scope', 'unknown', 'residents'] as const;
const DO = ['organize', 'directories', 'links', 'gaps', 'independent'] as const;
const DONT = ['replace', 'speak', 'alter', 'infer', 'transact'] as const;
const INDEPENDENCE = ['official', 'attribution', 'original'] as const;

const EVIDENCE: { to: string; key: string; descKey: string }[] = [
  { to: '/transparency/finance', key: 'nav-public-funds', descKey: 'about-evidence-funds' },
  { to: '/statistics', key: 'nav-statistics', descKey: 'about-evidence-stats' },
  { to: '/services', key: 'nav-services', descKey: 'about-evidence-services' },
];

const EXPLORE: { to: string; key: string; descKey: string }[] = [
  { to: '/services', key: 'about-explore-services', descKey: 'about-explore-services-desc' },
  { to: '/government', key: 'about-explore-government', descKey: 'about-explore-government-desc' },
  { to: '/transparency/finance', key: 'about-explore-funds', descKey: 'about-explore-funds-desc' },
];

const headingClass =
  'mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-balance text-heading md:text-3xl';
const monoLabel = 'font-mono text-[0.6875rem] font-medium tracking-[0.14em] uppercase';

function Flow({
  label,
  title,
  detail,
  accent = false,
}: {
  label: string;
  title?: string;
  detail?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? 'border border-royal/40 bg-white p-3'
          : 'border border-line bg-white px-4 py-3 text-center'
      }
    >
      <p className={`${monoLabel} ${accent ? 'text-center text-royal' : 'text-ink-faint'}`}>
        {label}
      </p>
      {title ? <p className="mt-1 text-sm font-bold text-heading">{title}</p> : null}
      {detail}
    </div>
  );
}

const Connector = () => <div aria-hidden="true" className="mx-auto h-5 w-px bg-line" />;

// About BetterMati, laid out like BetterSanFernando's /about: what the portal is, why it
// exists, what it organizes, its current scope, how it publishes, its principles, and
// where it stands relative to the City Government.
export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t('about-title')}
        description="What BetterMati.org is, why it exists, what it organizes and how it publishes public information about the City of Mati."
        canonicalPath="/about"
      />

      <PageHeader
        eyebrow={t('about-eyebrow')}
        title={t('about-title')}
        description={t('about-lede')}
        ledeTone="strong"
        note={t('about-note')}
        breadcrumb={[{ label: t('nav-home'), to: '/' }, { label: t('nav-about') }]}
        actions={
          <>
            <a
              href="#explore"
              className="inline-flex h-11 items-center gap-2 rounded-btn bg-royal px-5 text-sm font-semibold text-white transition-colors hover:bg-royal/90"
            >
              {t('about-cta-explore')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
            >
              {t('about-cta-process')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </>
        }
        sidePanel={
          <div
            className="border border-line bg-surface-subtle p-5"
            aria-label={t('about-flow-label')}
            role="figure"
          >
            <Flow
              label={t('about-flow-origin')}
              title={t('about-flow-origin-title')}
              detail={
                <p className="mt-1 text-xs text-ink-muted">{t('about-flow-origin-detail')}</p>
              }
            />
            <Connector />
            <Flow
              label={t('about-flow-portal')}
              accent
              detail={
                <ul className="mt-2 grid grid-cols-3 gap-1.5">
                  {DIRECTORIES.map((d) => (
                    <li key={d.to}>
                      <AppLink
                        to={d.to}
                        className="block bg-surface-subtle px-2 py-1.5 text-center text-xs font-medium text-heading hover:text-royal"
                      >
                        {t(d.key)}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              }
            />
            <Connector />
            <Flow
              label={t('about-flow-result')}
              title={t('about-flow-result-title')}
              detail={
                <p className="mt-1 text-xs text-ink-muted">{t('about-flow-result-detail')}</p>
              }
            />
          </div>
        }
      />

      {/* Why it exists */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p>
                <Eyebrow>{t('about-why-eyebrow')}</Eyebrow>
              </p>
              <h2 className={headingClass}>{t('about-why-title')}</h2>
              <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-ink-soft">
                <p>{t('about-why-p1')}</p>
                <p>{t('about-why-p2')}</p>
              </div>
              <p className="mt-6 max-w-2xl text-xl leading-snug font-bold text-heading">
                {t('about-why-goal')}
              </p>
            </div>
            <div className="self-start border border-line bg-surface-subtle p-5 lg:p-6">
              <h3 className="text-sm font-bold text-heading uppercase">
                {t('about-sources-title')}
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {SOURCES.map((s) => (
                  <li key={s} className="py-3">
                    <p className={`${monoLabel} text-royal`}>{t(`about-source-${s}`)}</p>
                    <p className="mt-1 text-sm text-ink">{t(`about-source-${s}-detail`)}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-2 border-t border-line pt-3 text-sm">
                <AppLink
                  to="/transparency/sources"
                  className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
                >
                  {t('sources-see-all')}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </AppLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* What BetterMati organizes */}
      <Section id="explore" className="border-t border-line">
        <Container>
          <SectionHead
            eyebrow={t('about-dir-eyebrow')}
            title={t('about-dir-title')}
            lede={t('about-dir-lede')}
          />
          <ol className="grid gap-x-12 md:grid-cols-2">
            {DIRECTORIES.map((d, i) => (
              <li key={d.to} className="border-b border-line">
                <AppLink to={d.to} className="group flex items-start gap-4 py-5">
                  <span className="mt-0.5 font-mono text-xs font-semibold text-royal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-heading group-hover:text-royal">
                      {t(d.key)}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-muted">
                      {t(d.descKey)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-0.5 size-4 shrink-0 text-ink-faint group-hover:text-royal"
                    aria-hidden="true"
                  />
                </AppLink>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Current public coverage */}
      <Section className="border-t border-line bg-surface-subtle">
        <Container>
          <SectionHead eyebrow={t('about-today-eyebrow')} title={t('about-today-title')} />
          <dl className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {COVERAGE.map((c) => (
              <div
                key={c.key}
                className="flex flex-col-reverse items-center bg-white px-4 py-6 text-center"
              >
                <dt className={`${monoLabel} mt-1 text-ink-muted`}>{t(c.key)}</dt>
                <dd className="font-display text-3xl font-bold text-heading tabular-nums">
                  {c.value.toLocaleString('en-US')}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-ink-muted">{t('about-today-note')}</p>
        </Container>
      </Section>

      {/* Publication process */}
      <Section id="process" className="border-t border-line">
        <Container>
          <SectionHead
            eyebrow={t('about-process-eyebrow')}
            title={t('about-process-title')}
            lede={t('about-process-lede')}
          />
          <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s} className="bg-white p-5">
                <p className="font-mono text-xl font-semibold text-royal">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-sm font-bold tracking-[0.04em] text-heading uppercase">
                  {t(`about-step-${s}`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{t(`about-step-${s}-desc`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Our approach */}
      <Section className="border-t border-line">
        <Container>
          <SectionHead eyebrow={t('about-approach-eyebrow')} title={t('about-approach-title')} />
          <p className={`${monoLabel} text-royal`}>{t('about-principles-label')}</p>
          <ul className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <li key={p}>
                <h3 className="font-bold text-heading">{t(`about-principle-${p}`)}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {t(`about-principle-${p}-desc`)}
                </p>
              </li>
            ))}
          </ul>

          <p className={`${monoLabel} mt-12 text-royal`}>{t('about-role-label')}</p>
          <div className="mt-4 grid border border-line md:grid-cols-2">
            {[
              { key: 'about-we-do', items: DO, muted: false },
              { key: 'about-we-dont', items: DONT, muted: true },
            ].map((col, i) => (
              <div
                key={col.key}
                className={`p-5 md:p-6 ${i > 0 ? 'border-t border-line md:border-t-0 md:border-l' : ''}`}
              >
                <h3
                  className={`text-sm font-bold uppercase ${col.muted ? 'text-ink-muted' : 'text-heading'}`}
                >
                  {t(col.key)}
                </h3>
                <ul className="mt-3 divide-y divide-line">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-3 py-2.5 text-sm ${col.muted ? 'text-ink-muted' : 'text-ink'}`}
                    >
                      <span aria-hidden="true" className="text-ink-faint">
                        —
                      </span>
                      {t(`${col.key}-${item}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust & independence */}
      <Section className="border-t border-line">
        <Container>
          <SectionHead eyebrow={t('about-trust-eyebrow')} title={t('about-trust-title')} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-line bg-white">
              <div className="border-b border-line p-5 md:p-6">
                <h3 className="font-bold text-heading">{t('about-evidence-title')}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{t('about-evidence-body')}</p>
              </div>
              <ul className="divide-y divide-line">
                {EVIDENCE.map((e) => (
                  <li key={e.to}>
                    <AppLink
                      to={e.to}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-subtle md:px-6"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-heading uppercase group-hover:text-royal">
                          {t(e.key)}
                        </span>
                        <span className="block text-xs leading-5 text-ink-muted">
                          {t(e.descKey)}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-ink-faint group-hover:text-royal"
                        aria-hidden="true"
                      />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-line bg-surface-subtle p-5 md:p-6">
              <h3 className="flex items-center gap-2 font-bold text-heading">
                <Info className="size-4 text-royal" aria-hidden="true" />
                {t('about-independent-title')}
              </h3>
              <dl className="mt-4 divide-y divide-line">
                {INDEPENDENCE.map((i) => (
                  <div key={i} className="py-3">
                    <dt className="text-sm font-bold text-heading uppercase">
                      {t(`about-independent-${i}`)}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-ink-muted">
                      {t(`about-independent-${i}-desc`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* Open project */}
      <Section className="border-t border-line">
        <Container>
          <div className="grid gap-6 border border-line bg-surface-subtle p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <div className="max-w-2xl">
              <p>
                <Eyebrow>{t('about-open-eyebrow')}</Eyebrow>
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-heading sm:text-2xl">
                {t('about-open-title')}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{t('about-open-body')}</p>
              <TextLink to="/about/logo" className="mt-4">
                {t('about-logo-link')}
              </TextLink>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-btn bg-royal px-4 text-sm font-semibold text-white transition-colors hover:bg-royal/90"
              >
                <FaGithub className="size-4" aria-hidden="true" />
                {t('footer-contribute')}
                <span className="sr-only"> ({t('service-new-tab')})</span>
              </a>
              <a
                href="mailto:volunteer@bettermati.org"
                className="inline-flex h-10 items-center gap-2 rounded-btn border border-line bg-white px-4 text-sm font-semibold text-heading transition-colors hover:border-royal hover:text-royal"
              >
                <Mail className="size-4" aria-hidden="true" />
                {t('footer-volunteer')}
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Start exploring */}
      <Section className="border-t border-line">
        <Container>
          <SectionHead
            eyebrow={t('about-start-eyebrow')}
            title={t('about-start-title')}
            lede={t('about-start-lede')}
          />
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {EXPLORE.map((e) => (
              <AppLink
                key={e.to}
                to={e.to}
                className="group flex flex-col bg-white p-5 transition-colors hover:bg-surface-subtle md:p-6"
              >
                <span className="font-bold text-heading group-hover:text-royal">{t(e.key)}</span>
                <span className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{t(e.descKey)}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal">
                  {t('about-open-directory')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </AppLink>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
