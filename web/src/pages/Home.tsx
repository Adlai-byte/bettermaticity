import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Compass,
  FileText,
  Store,
  Coins,
  HeartPulse,
  Users,
  Waves,
  Sun,
  CalendarDays,
  Sprout,
  ShieldAlert,
  Briefcase,
  Mail,
  MapPin,
} from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { ServiceSearch } from '@/components/ServiceSearch';
import { ImageSlot } from '@/components/ImageSlot';
import { PhotoCredit, PhotoSlot } from '@/components/PhotoSlot';
import { getPhoto } from '@/lib/tourismData';
import {
  Container,
  Eyebrow,
  RuledGrid,
  SectionHead,
  StatRow,
  TextLink,
} from '@/components/primitives';
import { useLanguage } from '@/hooks/useLanguage';
import VolunteerDialog from '@/components/VolunteerDialog';
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useReducedMotion,
  fadeUp,
  staggerContainer,
  revealViewport,
} from '@/components/motion';
import {
  totalPopulation,
  barangayCount,
  landAreaKm2,
  incomeClass,
  statisticsSources,
} from '@/lib/statsData';
import { annualFinancials, fiscalSource } from '@/lib/budgetData';
import { officials } from '@/lib/govData';
import { RisingProjects } from '@/components/RisingProjects';
import { ProjectMap } from '@/components/ProjectMap';

const FEEL_MATI_LOGO = '/assets/images/logo/feel-mati.png';

// Initials for the leadership avatar, e.g. "Hon. Joel Mayo Z. Almario" -> "JA".
function officialInitials(name: string): string {
  const parts = name
    .replace(/^Hon\.\s*/i, '')
    .replace(/["'.]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '—';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase() || '—';
}

// Easing for the funds-bar width fill (width isn't a transform, so MotionConfig's
// reducedMotion doesn't cover it — reduced motion sets the duration to 0 instead).
const barEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Content models ──────────────────────────────────────────────────────────

const popular: { to: string; Icon: LucideIcon; label: string; color: string; feel?: boolean }[] = [
  { to: '/services/certificates', Icon: FileText, label: 'Certificates', color: '#2b62ee' },
  { to: '/services/business', Icon: Store, label: 'Business Permits', color: '#0077be' },
  { to: '/services/tax-payments', Icon: Coins, label: 'Taxes & Fees', color: '#06a77d' },
  { to: '/services/health', Icon: HeartPulse, label: 'Health Services', color: '#e01b24' },
  { to: '/services/social-services', Icon: Users, label: 'Social Welfare', color: '#7c4dff' },
  { to: '/visit-mati', Icon: Waves, label: 'Tourism', color: '#8a6200', feel: true },
];

const tourism: {
  title: string;
  blurb: string;
  slot: string;
  /** Id of a photo in data/tourism.json's `photos`. */
  photo: string;
  badge?: string;
  large?: boolean;
}[] = [
  {
    title: 'Dahican Beach',
    blurb:
      'Seven kilometres of white sand on the Pacific side. Skimboarders at sunrise, surf through the amihan season, and sea-turtle nesting grounds watched by the Amihan sa Dahican volunteers.',
    slot: 'Drop a Dahican Beach photo — skimboarder at sunrise',
    photo: 'dahican-aerial',
    badge: 'Surf & skimboard',
    large: true,
  },
  {
    title: 'Pujada Bay',
    blurb:
      'A protected seascape of coral reefs, dugongs and dolphins — with island hopping out to Pujada Island.',
    slot: 'Drop a Pujada Bay photo',
    photo: 'pujada-bay-view',
  },
  {
    title: 'Sleeping Dinosaur',
    blurb: 'The ridge across the bay, best watched from the Baywalk and Boulevard at golden hour.',
    slot: 'Drop a Sleeping Dinosaur / Baywalk photo',
    photo: 'sleeping-dinosaur-aerial',
  },
];

const services: {
  to: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  tone: 'default' | 'danger' | 'feel';
}[] = [
  {
    to: '/services/certificates',
    Icon: FileText,
    title: 'Civil Registry',
    desc: 'Birth, marriage and death certificates from the City Civil Registrar.',
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/business',
    Icon: Store,
    title: 'Business & Livelihood',
    desc: 'Permits, renewals, market stalls and trade support through the BPLO.',
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/tax-payments',
    Icon: Coins,
    title: 'Taxes & Payments',
    desc: "Real property and business tax assessment at the Treasurer's Office.",
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/health',
    Icon: HeartPulse,
    title: 'Health Services',
    desc: 'Check-ups, vaccines and medicines through the City Health Office.',
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/social-services',
    Icon: Users,
    title: 'Social Welfare',
    desc: 'Assistance for seniors, PWDs, solo parents and indigent families.',
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/agriculture',
    Icon: Sprout,
    title: 'Agriculture & Fisheries',
    desc: 'Seedlings, coconut and fishery support from the City Agriculture Office.',
    tag: 'Services',
    tone: 'default',
  },
  {
    to: '/services/public-safety',
    Icon: ShieldAlert,
    title: 'Disaster Preparedness',
    desc: 'Evacuation routes, typhoon advisories and CDRRMO programs.',
    tag: 'Services',
    tone: 'danger',
  },
  {
    to: '/services',
    Icon: Waves,
    title: 'Tourism',
    desc: 'Dahican, Pujada Bay, Sambuokan Festival, accredited guides and homestays.',
    tag: 'Feel Mati',
    tone: 'feel',
  },
];

// Public funds use the same sourced annual snapshot as the transparency page.
function useFunds() {
  const q = annualFinancials;
  const rows = [
    { label: 'General public services', v: q.expenditures.gps, color: '#2b62ee' },
    { label: 'Social services', v: q.expenditures.social, color: '#0077be' },
    { label: 'Economic services', v: q.expenditures.economic, color: '#06a77d' },
    { label: 'Special Education Fund (SEF)', v: q.expenditures.sef ?? 0, color: '#b45b16' },
    { label: 'Debt services (operating)', v: q.expenditures.debt, color: '#e01b24' },
    { label: 'Non-operating expenditures', v: q.expenditures.nonOperating, color: '#7357b6' },
  ].map((r) => ({ ...r, per100: (r.v / q.expenditures.total) * 100 }));
  return {
    incomeTotal: q.receipts.total,
    local: q.receipts.local,
    external: q.receipts.external,
    nonIncome: q.receipts.nonIncome,
    spendTotal: q.expenditures.total,
    rows,
    balance: q.endingCashBalance,
  };
}

const M = (n: number) => `₱${n.toFixed(2)}M`;

function useMatiWeather() {
  const [temp, setTemp] = useState<string | null>(null);
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=6.9497&longitude=126.2094&current_weather=true'
    )
      .then((r) => r.json())
      .then((d) => {
        if (d?.current_weather?.temperature != null)
          setTemp(`${Math.round(d.current_weather.temperature)}°C`);
      })
      .catch(() => {});
  }, []);
  return temp;
}

export default function Home() {
  const temp = useMatiWeather();
  const funds = useFunds();
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <LazyMotion features={domAnimation}>
      {/* reducedMotion="user" drops movement (transform/y) but keeps opacity fades when the
          OS "Reduce Motion" setting is on — applied once for the whole page. */}
      <MotionConfig reducedMotion="user">
        <Seo description="Everything the City of Mati does, in one place — government services, public funds, and the coast that makes this place worth the trip." />
        {/* ── Hero: city-hall photo under a navy wash, text left + search card right ── */}
        {/* No overflow-hidden: the search results overlay must be able to extend past the
            hero; z-10 keeps it above the next section. */}
        <section className="relative isolate z-10 bg-navy text-white">
          <div className="absolute inset-0 -z-10">
            <ImageSlot label="City of Mati" src="./bg-matigov_hero.jpg" />
          </div>
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(18,60,122,0.95)_0%,rgba(18,60,122,0.82)_46%,rgba(18,60,122,0.55)_78%,rgba(18,60,122,0.42)_100%)]"
            aria-hidden="true"
          />
          <Container>
            <div className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
              {/* Left — staggered entrance on mount */}
              <m.div
                className="flex flex-col items-start"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <m.img
                  variants={fadeUp}
                  src={FEEL_MATI_LOGO}
                  alt="Feel Mati"
                  className="mb-5 h-auto w-52 sm:w-60"
                />
                <m.div variants={fadeUp}>
                  <Eyebrow tone="dark">{t('nav-drawer-place')}</Eyebrow>
                </m.div>
                <m.h1
                  variants={fadeUp}
                  className="mt-3 font-display text-[2.25rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3rem]"
                >
                  Everything the city does, in one place.
                </m.h1>
                <m.p
                  variants={fadeUp}
                  className="mt-5 max-w-[34rem] text-lg leading-snug font-medium text-white/90 sm:text-[1.25rem]"
                >
                  A community-powered portal for the City of Mati, Davao Oriental — government
                  services, public funds, and the coast that makes this place worth the trip.
                </m.p>
                <m.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2.5">
                  <AppLink
                    to="/services"
                    className="inline-flex h-11 items-center gap-2 rounded-btn bg-amber px-5 text-[0.9375rem] font-bold text-navy transition hover:brightness-105"
                  >
                    Browse Services <ArrowRight className="size-3.5" aria-hidden="true" />
                  </AppLink>
                  <AppLink
                    to="/services/environment"
                    className="inline-flex h-11 items-center gap-2 rounded-btn border border-white/35 px-5 text-[0.9375rem] font-semibold text-white transition hover:bg-white/10"
                  >
                    <Compass className="size-3.5" aria-hidden="true" /> Plan a visit
                  </AppLink>
                </m.div>
              </m.div>

              {/* Right — search card */}
              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="w-full rounded-card border border-white/20 bg-white p-5 text-ink sm:p-6"
              >
                <Eyebrow>{t('nav-search')}</Eyebrow>
                <div className="mt-3">
                  <ServiceSearch placeholder="Search for a service…" />
                </div>
                <p className="mt-5 mb-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-ink-muted uppercase">
                  Popular services
                </p>
                <RuledGrid className="grid-cols-2 sm:grid-cols-3">
                  {popular.map(({ to, Icon, label, color, feel }) => (
                    <AppLink
                      key={label}
                      to={to}
                      className={`flex h-full flex-col items-start gap-2.5 p-4 text-heading transition ${
                        feel ? 'bg-feel-bg hover:bg-feel-tint' : 'bg-white hover:bg-royal-tint'
                      }`}
                    >
                      <Icon className="size-5" style={{ color }} aria-hidden="true" />
                      <span className="text-[0.8125rem] leading-tight font-semibold">{label}</span>
                    </AppLink>
                  ))}
                </RuledGrid>
              </m.div>
            </div>
          </Container>
        </section>

        {/* ── Mati at a Glance ─────────────────────────────────────────────── */}
        <section className="border-b border-line bg-surface-subtle py-14">
          <Container>
            <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={revealViewport}>
              <SectionHead
                eyebrow="City profile"
                title="Mati at a Glance"
                action={<TextLink to="/statistics">View City Profile</TextLink>}
              />
              <StatRow
                className="border-b"
                items={[
                  {
                    label: 'Residents',
                    value: totalPopulation.toLocaleString(),
                    caption: 'PSA 2024 POPCEN',
                  },
                  {
                    label: 'Barangays',
                    value: String(barangayCount),
                    caption: 'Administrative villages',
                  },
                  {
                    label: 'Component City',
                    value: `${incomeClass} Class`,
                    caption: 'Income classification',
                  },
                  {
                    label: 'km² land area',
                    value: landAreaKm2,
                    caption: (
                      <a
                        href={statisticsSources.area.url}
                        className="underline underline-offset-4 hover:text-royal"
                      >
                        PSA · 2013 land-area basis
                      </a>
                    ),
                  },
                ]}
              />
            </m.div>

            <m.div
              className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.9fr]"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              {/* Weather card */}
              <div className="flex flex-col justify-between rounded-card bg-[linear-gradient(160deg,#2b62ee_0%,#7aa5ff_100%)] p-6 text-white">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[0.71875rem] font-semibold tracking-[0.14em] uppercase">
                    <Sun className="size-4" aria-hidden="true" /> Weather
                  </div>
                  <div className="mt-3.5 text-[0.8125rem] text-white/80">
                    City of Mati, Davao Oriental
                    <br />
                    <span className="font-mono text-xs">6.9497° N, 126.2094° E</span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="font-display text-5xl leading-none font-extrabold tracking-[-0.04em]">
                    {temp ?? '—'}
                  </div>
                  <div className="mt-1.5 text-sm font-semibold">Current conditions</div>
                  <div className="mt-3 text-xs text-white/75">Province of Davao Oriental</div>
                </div>
              </div>
              {/* Map */}
              <div className="relative min-h-[240px] overflow-hidden rounded-card border border-line bg-royal-tint">
                <iframe
                  title="Map of the City of Mati"
                  className="size-full min-h-[240px]"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=126.1694%2C6.9097%2C126.2494%2C6.9897&layer=mapnik&marker=6.9497%2C126.2094"
                />
                <span className="pointer-events-none absolute bottom-2.5 left-3 rounded-btn border border-line bg-white/95 px-2 py-1 font-mono text-xs text-ink-muted">
                  Mati 6.9497, 126.2094
                </span>
              </div>
            </m.div>
          </Container>
        </section>

        <RisingProjects />

        {/* ── Project map ──────────────────────────────────────────────────── */}
        <section id="project-map" className="border-y border-line bg-white py-14">
          <Container>
            <SectionHead eyebrow={t('map-eyebrow')} title={t('map-title')} lede={t('map-lede')} />
            <ProjectMap compact />
          </Container>
        </section>

        {/* ── Feel Mati — tourism ──────────────────────────────────────────── */}
        <section className="bg-navy py-16">
          <Container>
            <m.div
              className="mb-7 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div>
                <img src={FEEL_MATI_LOGO} alt="Feel Mati" className="h-auto w-40" />
                <h2 className="mt-4 mb-2 font-display text-[1.75rem] leading-[1.12] font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
                  More adventures, truly incredible
                </h2>
                <p className="max-w-[560px] text-base leading-relaxed text-white/75">
                  The skimboarding capital of the Philippines, a protected bay of coral and dugongs,
                  and a ridge the whole city knows by silhouette.
                </p>
              </div>
              <AppLink
                to="/visit-mati"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-btn bg-amber px-5 text-[0.9375rem] font-bold text-navy transition hover:brightness-105"
              >
                Plan your visit <ArrowRight className="size-3.5" aria-hidden="true" />
              </AppLink>
            </m.div>

            <m.div
              className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              {tourism.map((tp) => {
                const photo = getPhoto(tp.photo);
                return (
                  <m.article
                    key={tp.title}
                    variants={fadeUp}
                    className="flex flex-col overflow-hidden rounded-card border border-line bg-white text-ink"
                  >
                    <div className={tp.large ? 'h-56' : 'h-48'}>
                      <PhotoSlot
                        photo={photo}
                        label={tp.slot}
                        sizes={
                          tp.large
                            ? '(min-width: 1024px) 45vw, 100vw'
                            : '(min-width: 1024px) 28vw, 100vw'
                        }
                        decorative
                        className="border-0 border-b"
                      />
                    </div>
                    <div className="grid gap-1.5 p-5">
                      {tp.badge ? (
                        <span className="w-fit rounded-btn bg-amber px-2 py-0.5 font-mono text-[0.65625rem] font-semibold tracking-[0.1em] text-navy uppercase">
                          {tp.badge}
                        </span>
                      ) : null}
                      <h3
                        className={`font-display font-extrabold tracking-[-0.02em] text-heading ${
                          tp.large ? 'text-xl' : 'text-[1.0625rem]'
                        }`}
                      >
                        {tp.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-ink-muted">{tp.blurb}</p>
                      {photo ? <PhotoCredit photo={photo} className="mt-1 text-ink-faint" /> : null}
                    </div>
                  </m.article>
                );
              })}
            </m.div>

            <m.div
              className="mt-4 flex flex-col items-start justify-between gap-4 rounded-r-card border border-l-4 border-amber/40 border-l-amber bg-amber/[0.07] px-[22px] py-4 sm:flex-row sm:items-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <div className="flex items-center gap-3.5">
                <CalendarDays className="size-5 text-amber" aria-hidden="true" />
                <div>
                  <div className="text-[0.9375rem] font-bold text-white">
                    Sambuokan Festival · every October
                  </div>
                  <div className="text-[0.8125rem] text-white/70">
                    The city&apos;s founding celebration — &ldquo;sambuok&rdquo;, to gather as one.
                  </div>
                </div>
              </div>
              <AppLink
                to="/visit-mati"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-amber underline decoration-1 underline-offset-[5px] hover:decoration-2"
              >
                Festival guide <ArrowRight className="size-3.5" aria-hidden="true" />
              </AppLink>
            </m.div>
          </Container>
        </section>

        {/* ── City Services ────────────────────────────────────────────────── */}
        <section className="bg-white py-14">
          <Container>
            <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={revealViewport}>
              <SectionHead
                eyebrow="City services"
                title="City Services"
                lede="Find the right service for your need — from certificates and permits to health, welfare and disaster preparedness."
              />
            </m.div>
            <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={revealViewport}>
              <RuledGrid className="sm:grid-cols-2 lg:grid-cols-4">
                {services.map(({ to, Icon, title, desc, tag, tone }) => {
                  const feel = tone === 'feel';
                  const danger = tone === 'danger';
                  return (
                    <AppLink
                      key={title}
                      to={to}
                      className={`group flex min-w-0 flex-col gap-3 p-5 text-ink-muted transition-colors ${
                        feel
                          ? 'bg-feel-bg shadow-[inset_0_0_0_1px_#ffc001]'
                          : 'bg-white hover:bg-surface-subtle'
                      }`}
                    >
                      <span
                        className={`flex size-[38px] items-center justify-center rounded-md ${
                          danger
                            ? 'bg-danger-tint text-[#e01b24]'
                            : feel
                              ? 'bg-feel-tint text-[#a37400]'
                              : 'bg-royal-tint text-royal'
                        }`}
                      >
                        <Icon className="size-[17px]" aria-hidden="true" />
                      </span>
                      <div className="text-[0.9375rem] font-bold text-heading group-hover:text-royal">
                        {title}
                      </div>
                      <p className="text-[0.8125rem] leading-relaxed">{desc}</p>
                      <span
                        className={`mt-auto inline-flex h-[22px] w-fit items-center px-2.5 text-xs font-semibold ${
                          danger
                            ? 'bg-danger-tint text-[#b3151c]'
                            : feel
                              ? 'bg-feel-tint text-feel-text'
                              : 'bg-royal-tint text-royal'
                        }`}
                      >
                        {tag}
                      </span>
                    </AppLink>
                  );
                })}
              </RuledGrid>
            </m.div>
          </Container>
        </section>

        {/* ── Public Funds + City Leadership ───────────────────────────────── */}
        <section className="border-y border-line bg-surface-subtle py-14">
          <Container>
            <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
              {/* Public Funds */}
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
              >
                <SectionHead
                  eyebrow="Transparency"
                  title="Public Funds"
                  className="mb-5"
                  action={
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-btn border border-line bg-white px-2.5 font-mono text-[0.6875rem] text-ink-muted">
                      <span className="size-1.5 rounded-full bg-[#06a77d]" aria-hidden="true" /> DBM
                      / BLGF · FY2025
                    </span>
                  }
                />

                <div className="overflow-hidden rounded-card border border-line bg-white">
                  <div className="border-b border-line p-[22px]">
                    <div className="text-sm text-ink-muted">Total receipts, FY2025</div>
                    <div className="mt-1.5 mb-1 font-display text-4xl leading-none font-extrabold tracking-[-0.04em] text-royal tabular-nums sm:text-5xl">
                      {M(funds.incomeTotal)}
                    </div>
                    <div className="font-mono text-xs text-ink-muted">
                      LOCAL {M(funds.local)} · EXTERNAL {M(funds.external)} · NON-INCOME{' '}
                      {M(funds.nonIncome)}
                    </div>
                    <a
                      href={`${fiscalSource.url}#page=3`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-xs text-royal underline underline-offset-4"
                    >
                      Source: {fiscalSource.label}
                    </a>
                  </div>
                  <div className="p-[22px]">
                    <div className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-muted">
                      WHERE EVERY ₱100 OF SPENDING WENT
                    </div>
                    <div className="mt-3.5 grid gap-3">
                      {funds.rows.map((r) => (
                        <div
                          key={r.label}
                          className="grid grid-cols-[130px_1fr_56px] items-center gap-3 text-[0.8125rem] text-heading sm:grid-cols-[170px_1fr_62px]"
                        >
                          <span>{r.label}</span>
                          <span className="h-2.5 rounded-none bg-line">
                            {/* Always render the same element so the prerendered HTML and the
                                first client render match; reduced motion only zeroes the duration. */}
                            <m.span
                              className="block h-2.5 rounded-none"
                              style={{ background: r.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${r.per100}%` }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={
                                reduce ? { duration: 0 } : { duration: 0.9, ease: barEase }
                              }
                            />
                          </span>
                          <span className="text-right font-mono tabular-nums">
                            ₱{r.per100.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-line bg-surface-subtle px-[22px] py-3.5 font-mono text-[0.6875rem] text-ink-muted">
                    <span>
                      SPENT {M(funds.spendTotal)} · ENDING CASH {M(funds.balance)}
                    </span>
                    <AppLink to="/transparency/finance" className="font-semibold text-royal">
                      FULL SRE →
                    </AppLink>
                  </div>
                </div>
              </m.div>

              {/* City Leadership */}
              <div>
                <SectionHead eyebrow="City government" title="City Leadership" className="mb-5" />
                <m.div
                  className="grid gap-px overflow-hidden rounded-card border border-line bg-line"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={revealViewport}
                >
                  {[
                    {
                      role: 'Elected Mayor',
                      name: officials.mayor?.name ?? 'Hon. [to be confirmed]',
                      image: officials.mayor?.image,
                      sub: 'City Mayor · City of Mati',
                    },
                    {
                      role: 'Elected Vice Mayor',
                      name: officials.vice_mayor?.name ?? 'Hon. [to be confirmed]',
                      image: officials.vice_mayor?.image,
                      sub: 'City Vice Mayor · Sangguniang Panlungsod',
                    },
                  ].map((l) => (
                    <m.div
                      key={l.role}
                      variants={fadeUp}
                      className="flex items-center gap-3.5 bg-white p-[18px]"
                    >
                      {l.image ? (
                        <img
                          src={l.image}
                          alt=""
                          width={48}
                          height={48}
                          loading="lazy"
                          className="size-12 shrink-0 rounded-full bg-royal-tint object-cover"
                        />
                      ) : (
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-royal-tint text-[0.9375rem] font-bold text-royal">
                          {officialInitials(l.name)}
                        </span>
                      )}
                      <div>
                        <span className="inline-flex h-5 items-center bg-royal-tint px-2.5 text-[0.6875rem] font-semibold text-royal">
                          {l.role}
                        </span>
                        <div className="mt-1.5 text-[0.9375rem] font-bold text-heading">
                          {l.name}
                        </div>
                        <div className="text-[0.8125rem] text-ink-muted">{l.sub}</div>
                      </div>
                    </m.div>
                  ))}

                  {officials.councilors && officials.councilors.length > 0 && (
                    <m.div variants={fadeUp} className="bg-white p-[18px]">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <Eyebrow>Sangguniang Panlungsod</Eyebrow>
                        <span className="font-mono text-[0.6875rem] text-ink-muted">
                          {officials.councilors.length} Councilors
                        </span>
                      </div>
                      <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                        {officials.councilors.map((c, i) => (
                          <li
                            key={c.name}
                            className="flex items-baseline gap-2 text-[0.8125rem] text-heading"
                          >
                            <span
                              className="min-w-[18px] font-mono text-[0.65625rem] text-ink-muted"
                              aria-hidden="true"
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {c.name.replace(/^Hon\.\s*/i, '')}
                          </li>
                        ))}
                      </ul>
                      <TextLink to="/government/officials" className="mt-3">
                        Meet the full council
                      </TextLink>
                    </m.div>
                  )}

                  <m.div variants={fadeUp} className="grid gap-2.5 bg-white p-[18px]">
                    <div className="flex items-center gap-3">
                      <span className="flex size-[34px] items-center justify-center rounded-md bg-royal-tint text-royal">
                        <MapPin className="size-[15px]" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-muted">
                          CITY HALL
                        </div>
                        <div className="text-sm font-semibold text-heading">
                          Nazareno St., City of Mati, Davao Oriental
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-[34px] items-center justify-center rounded-md bg-[#eaf7f2] text-[#06a77d]">
                        <Mail className="size-[15px]" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-muted">
                          EMAIL
                        </div>
                        <a
                          href="mailto:cio.cityofmati@gmail.com"
                          className="text-sm font-semibold text-royal hover:underline"
                        >
                          cio.cityofmati@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-[34px] items-center justify-center rounded-md bg-feel-tint text-[#a37400]">
                        <Briefcase className="size-[15px]" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-muted">
                          JOBS
                        </div>
                        <AppLink
                          to="/government"
                          className="text-sm font-semibold text-royal hover:underline"
                        >
                          TrabaWho — city job openings
                        </AppLink>
                      </div>
                    </div>
                  </m.div>
                </m.div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── ₱0 cost line (signature line; site-wide Footer follows below) ──── */}
        <section className="bg-white py-11">
          <Container>
            <m.p
              className="flex flex-wrap items-baseline justify-center gap-x-7 gap-y-1.5 text-center text-[0.9375rem] text-ink-muted"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
            >
              <span>
                Cost to build this site to date:{' '}
                <strong className="font-extrabold text-ink">₱400+</strong>
              </span>
              <span>
                Cost to the People of Mati:{' '}
                <strong className="inline-block border-b-4 border-amber font-display text-3xl leading-none font-extrabold tracking-[-0.03em] text-navy">
                  ₱0
                </strong>
              </span>
            </m.p>
          </Container>
        </section>

        <VolunteerDialog />
      </MotionConfig>
    </LazyMotion>
  );
}
