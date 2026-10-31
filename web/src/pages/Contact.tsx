import { ArrowDown, ArrowRight, ArrowUpRight, Mail, TriangleAlert } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { useLanguage } from '@/hooks/useLanguage';
import { Band, Container, PageHeader } from '@/components/primitives';
import {
  emergencyHotlines as emergency,
  medicalHotlines as medical,
  nationalHotline,
  primaryNumber,
  type Hotline,
} from '@/lib/hotlines';
import { HotlineGrid, HotlineSourceNote } from '@/components/HotlineDirectory';

// City Hall's general channels, as published on the legacy site. They are not yet
// confirmed by the City (see the LGU data checklist).
const CHANNELS: { labelKey: string; value: string; href: string }[] = [
  { labelKey: 'contact-email', value: 'lgumatinv@gmail.com', href: 'mailto:lgumatinv@gmail.com' },
  { labelKey: 'contact-mobile', value: '0917-595-1931', href: 'tel:09175951931' },
  { labelKey: 'contact-phone', value: '(087) 805-3581', href: 'tel:0878053581' },
];

const HOURS: { dayKey: string; timeKey: string }[] = [
  { dayKey: 'contact-page-weekdays', timeKey: 'contact-page-weekdays-time' },
  { dayKey: 'contact-lunch-break', timeKey: 'contact-page-lunch-time' },
  { dayKey: 'contact-page-weekends', timeKey: 'contact-closed' },
  { dayKey: 'contact-national-local-holidays', timeKey: 'contact-closed' },
];

// The four numbers people reach for first; the full directory follows further down.
const FEATURED_IDS = ['cdrrmo', 'pnp-mati', 'bfp-mati'];
const featured: (Hotline | Omit<Hotline, 'category'>)[] = [
  nationalHotline,
  ...FEATURED_IDS.map((id) => emergency.find((h) => h.id === id)).filter((h): h is Hotline =>
    Boolean(h)
  ),
];

const ROUTES: { to: string; key: string; descKey: string; external?: boolean }[] = [
  { to: '/government/offices', key: 'gov-link-offices', descKey: 'contact-page-route-offices' },
  {
    to: '/government/barangays',
    key: 'gov-link-barangays',
    descKey: 'contact-page-route-barangays',
  },
  {
    to: '/government/officials',
    key: 'officials-elected-officials',
    descKey: 'contact-page-route-officials',
  },
  {
    to: '/government/links',
    key: 'links-title',
    descKey: 'nav-desc-official-links',
  },
];

const BEFORE = ['direct', 'directory', 'change'];

// Contact page, laid out like BetterSanFernando's /government/contact: emergency
// numbers first, then City Hall's channels and hours, a "what are you looking for"
// router, the full hotline directory (#hotlines, the hotline bar's target) and notes.
export default function Contact() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t('contact-contact')}
        description="Emergency hotlines and City Hall contact details for the City of Mati, Davao Oriental."
        canonicalPath="/contact"
      />

      <PageHeader
        badge={
          <>
            <Mail className="size-4" aria-hidden="true" />
            {t('contact-page-eyebrow')}
          </>
        }
        breadcrumb={[{ label: t('nav-home'), to: '/' }, { label: t('contact-contact') }]}
        title={t('contact-page-title')}
        description={t('contact-page-lede')}
        aside={{
          label: t('contact-page-about-label'),
          title: t('contact-page-about-title'),
          body: t('contact-page-about-body'),
        }}
      />

      {/* Emergency contacts */}
      <section
        aria-labelledby="emergency-heading"
        className="border-b border-line bg-white py-10 sm:py-12"
      >
        <Container>
          <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-red-700 uppercase">
            <TriangleAlert className="size-3.5" aria-hidden="true" />
            {t('contact-page-emergency-eyebrow')}
          </p>
          <h2
            id="emergency-heading"
            className="mt-2 text-2xl font-bold tracking-[-0.02em] text-heading md:text-3xl"
          >
            {t('contact-page-emergency-title')}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            {t('contact-page-emergency-lede')}
          </p>
          <div className="mt-6 grid grid-cols-1 border-t border-l border-red-200 bg-red-50/40 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((h) => {
              const n = primaryNumber(h);
              const name = t(h.nameKey, { defaultValue: h.name });
              const label =
                h === nationalHotline
                  ? t('hotline-bar-national')
                  : h.shortKey
                    ? t(h.shortKey)
                    : h.short;
              return (
                <article
                  key={n.tel}
                  className="flex flex-col justify-between border-r border-b border-red-200 p-5"
                >
                  <div>
                    <p className="text-[0.6875rem] font-bold tracking-wider text-red-700 uppercase">
                      {label}
                    </p>
                    <h3 className="mt-1.5 text-sm font-bold text-heading">{name}</h3>
                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-red-950 tabular-nums sm:text-3xl">
                      {n.display}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-red-200/70 pt-3">
                    <a
                      href={`tel:${n.tel}`}
                      aria-label={t('contact-page-call', { name, number: n.display })}
                      className="inline-flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-900"
                    >
                      {t('contact-page-call-short')}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <a
            href="#hotlines"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-royal hover:underline"
          >
            {t('contact-page-all-hotlines')}
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
        </Container>
      </section>

      {/* City Hall: channels and office hours */}
      <Band
        id="city-hall"
        eyebrow={t('contact-page-cityhall-eyebrow')}
        title={t('contact-page-cityhall-title')}
        lede={t('contact-page-cityhall-lede')}
      >
        <div className="mt-6 grid grid-cols-1 border border-line md:grid-cols-2">
          <div className="p-5 sm:p-6">
            <h3 className="text-xs font-bold tracking-wider text-royal uppercase">
              {t('contact-page-channels')}
            </h3>
            <dl className="mt-3 divide-y divide-line">
              {CHANNELS.map((c) => (
                <div key={c.labelKey} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-ink-muted">{t(c.labelKey)}</dt>
                  <dd>
                    <a
                      href={c.href}
                      className="font-mono text-sm font-semibold text-heading tabular-nums hover:text-royal hover:underline"
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border-t border-line p-5 sm:p-6 md:border-t-0 md:border-l">
            <h3 className="text-xs font-bold tracking-wider text-royal uppercase">
              {t('contact-office-hours')}
            </h3>
            <dl className="mt-3 divide-y divide-line">
              {HOURS.map((h) => (
                <div key={h.dayKey} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-ink-muted">{t(h.dayKey)}</dt>
                  <dd className="text-sm font-semibold text-heading">{t(h.timeKey)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink-faint">{t('contact-page-cityhall-note')}</p>
      </Band>

      {/* What are you looking for? */}
      <Band
        id="find-contact"
        eyebrow={t('contact-page-route-eyebrow')}
        title={t('contact-page-route-title')}
        lede={t('contact-page-route-lede')}
      >
        <div className="mt-6 grid grid-cols-1 border-t border-l border-line md:grid-cols-2">
          {ROUTES.map((r) => {
            const body = (
              <>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-heading group-hover:text-royal">
                    {t(r.key)}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-ink-muted">
                    {t(r.descKey)}
                  </span>
                </span>
                {r.external ? (
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-faint group-hover:text-royal"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    className="size-4 shrink-0 text-ink-faint group-hover:text-royal"
                    aria-hidden="true"
                  />
                )}
              </>
            );
            const cls =
              'group flex items-center justify-between gap-4 border-r border-b border-line p-5 transition-colors hover:bg-surface-subtle sm:p-6';
            return r.external ? (
              <a key={r.to} href={r.to} target="_blank" rel="noopener noreferrer" className={cls}>
                {body}
              </a>
            ) : (
              <AppLink key={r.to} to={r.to} className={cls}>
                {body}
              </AppLink>
            );
          })}
        </div>
      </Band>

      {/* Full hotline directory (target of the hotline bar's "View all hotlines") */}
      <Band
        id="hotlines"
        eyebrow={t('contact-page-directory-eyebrow')}
        title={t('contact-page-directory-title')}
        lede={t('contact-hotlines-desc')}
      >
        <h3 className="mt-8 mb-3 text-xs font-bold tracking-wider text-red-700 uppercase">
          {t('hotline-emergency')}
        </h3>
        <HotlineGrid hotlines={emergency} tone="emergency" />
        <h3 className="mt-8 mb-3 text-xs font-bold tracking-wider text-royal uppercase">
          {t('contact-medical')}
        </h3>
        <HotlineGrid hotlines={medical} tone="medical" />
        <HotlineSourceNote />
      </Band>

      {/* Before you contact the City */}
      <Band
        id="before-you-contact"
        eyebrow={t('contact-page-before-eyebrow')}
        title={t('contact-page-before-title')}
        last
      >
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {BEFORE.map((k) => (
            <div key={k} className="space-y-1.5">
              <h3 className="text-base font-bold text-heading">{t(`contact-page-before-${k}`)}</h3>
              <p className="text-sm leading-6 text-ink-soft">
                {t(`contact-page-before-${k}-desc`)}
              </p>
            </div>
          ))}
        </div>
      </Band>
    </>
  );
}
