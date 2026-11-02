import { useMemo, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Info,
  Waves,
  Wind,
  Heart,
  Trees,
  Compass,
  Eye,
  Sunset,
  Store,
  Fish,
  PartyPopper,
  Plane,
  Signpost,
  House,
  ShieldCheck,
  HandHelping,
  Flag,
  CalendarDays,
  CalendarPlus,
  Radio,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { ImageSlot } from '@/components/ImageSlot';
import { PhotoCredit, PhotoSlot } from '@/components/PhotoSlot';
import { Container } from '@/components/primitives';
import { useLanguage } from '@/hooks/useLanguage';
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  fadeUp,
  staggerContainer,
  revealViewport,
} from '@/components/motion';
import {
  hero,
  conditions,
  coasts,
  attractions,
  filters,
  months,
  seasons,
  sambuokan,
  plan,
  responsible,
  tourismOffice,
  getPhoto,
  photos,
  type Attraction,
  type Coast,
} from '@/lib/tourismData';

const FEEL_MATI_LOGO = '/assets/images/logo/feel-mati.png';

// Shared eyebrow: a short rule + mono label, used above every section heading.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-0.5 w-6 bg-royal" aria-hidden="true" />
      <span className="font-mono text-xs font-semibold tracking-[0.08em] text-royal uppercase">
        {children}
      </span>
    </div>
  );
}

// Icons for the two-coasts activity tags, keyed by tag label.
const TAG_ICONS: Record<string, LucideIcon> = {
  Skimboarding: Waves,
  'Surf lessons': Wind,
  'Turtle conservation': Heart,
  'Mangrove boardwalk': Trees,
  'Island hopping': Compass,
  Snorkelling: Eye,
  'Sleeping Dinosaur view': Sunset,
  'Baywalk food stalls': Store,
};

const SEASON_ICONS: Record<string, LucideIcon> = {
  waves: Waves,
  fish: Fish,
  compass: Compass,
  party: PartyPopper,
};

const PLAN_ICONS: Record<string, LucideIcon> = {
  plane: Plane,
  signpost: Signpost,
  house: House,
};

const sambuokanPhoto = getPhoto(sambuokan.photo);

const COAST_IMAGE_LABEL: Record<string, string> = {
  pacific: 'Drop a Pacific-side photo — Dahican surf',
  bay: 'Drop a bay-side photo — Pujada Island from a boat',
};

function CoastCard({ coast }: { coast: Coast }) {
  const pacific = coast.key === 'pacific';
  const photo = getPhoto(coast.photo);
  return (
    <m.div
      variants={fadeUp}
      className={
        pacific
          ? 'flex flex-col overflow-hidden rounded-card bg-navy text-white'
          : 'flex flex-col overflow-hidden rounded-card bg-surface-subtle text-heading ring-1 ring-line'
      }
    >
      <div className="relative aspect-[16/9]">
        <PhotoSlot
          photo={photo}
          label={COAST_IMAGE_LABEL[coast.key]}
          sizes="(min-width: 768px) 50vw, 100vw"
          decorative
        />
        <span
          className={
            pacific
              ? 'absolute top-4 left-4 inline-flex h-6 items-center gap-1.5 bg-amber px-2.5 text-xs font-bold text-navy'
              : 'absolute top-4 left-4 inline-flex h-6 items-center gap-1.5 bg-royal px-2.5 text-xs font-bold text-white'
          }
        >
          {pacific ? (
            <Waves className="size-3" aria-hidden="true" />
          ) : (
            <LifeBuoy className="size-3" aria-hidden="true" />
          )}
          {coast.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <div>
          <h3 className="mb-1.5 font-display text-2xl font-extrabold tracking-[-0.02em]">
            {coast.title}
          </h3>
          <p
            className={`text-[0.9375rem] leading-relaxed ${pacific ? 'text-white/85' : 'text-ink-muted'}`}
          >
            {coast.blurb}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {coast.tags.map((tag) => {
            const Icon = TAG_ICONS[tag];
            return (
              <span
                key={tag}
                className={
                  pacific
                    ? 'inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[0.8125rem] font-medium text-white'
                    : 'inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-white px-2.5 text-[0.8125rem] font-medium text-heading ring-1 ring-line'
                }
              >
                {Icon ? (
                  <Icon
                    className={`size-3.5 ${pacific ? 'text-amber' : 'text-royal'}`}
                    aria-hidden="true"
                  />
                ) : null}
                {tag}
              </span>
            );
          })}
        </div>
        <a
          href="#places"
          className={`mt-auto inline-flex items-center gap-1.5 font-display text-[0.9375rem] font-bold ${
            pacific ? 'text-amber' : 'text-royal'
          }`}
        >
          {coast.linkLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
        {photo ? (
          <PhotoCredit photo={photo} className={pacific ? 'text-white/60' : 'text-ink-faint'} />
        ) : null}
      </div>
    </m.div>
  );
}

function PlaceCard({ a }: { a: Attraction }) {
  const photo = getPhoto(a.photo);
  const inner = (
    <>
      <div className="relative aspect-[4/3] bg-surface-subtle">
        <PhotoSlot
          photo={photo}
          label={a.imageLabel}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          decorative
        />
        <span className="absolute top-3 left-3 inline-flex h-[22px] items-center bg-white/95 px-2.5 text-[0.6875rem] font-bold text-heading">
          {a.filter}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pb-[18px]">
        <h3 className="font-display text-[1.0625rem] font-extrabold tracking-[-0.015em] text-heading">
          {a.name}
        </h3>
        <p className="text-sm leading-[1.55] text-ink-muted">{a.blurb}</p>
        <div className="mt-auto flex flex-col gap-1.5 pt-2.5 text-xs text-ink-muted shadow-[inset_0_1px_0_var(--tone-line)]">
          <span className="flex items-center gap-1.5 pt-2">
            <MapPin className="size-3 shrink-0 text-royal" aria-hidden="true" />
            {a.where}
          </span>
          <span className="flex items-center gap-1.5">
            <Info className="size-3 shrink-0 text-royal" aria-hidden="true" />
            {a.note}
          </span>
          {photo ? <PhotoCredit photo={photo} className="text-ink-faint" /> : null}
        </div>
      </div>
    </>
  );

  const className =
    'group flex h-full flex-col overflow-hidden rounded-card bg-white border border-line transition hover:border-royal';

  if (a.featured) {
    return (
      <m.div variants={fadeUp} className="h-full">
        <AppLink to={`/visit-mati/${a.slug}`} className={className}>
          {inner}
        </AppLink>
      </m.div>
    );
  }
  return (
    <m.article variants={fadeUp} className={className}>
      {inner}
    </m.article>
  );
}

function seasonBarClass(state: string): string {
  if (state === 'peak') return 'bg-amber';
  if (state === 'on') return 'bg-royal';
  return 'bg-surface-subtle';
}

export default function VisitMati() {
  const { t } = useLanguage();
  const [active, setActive] = useState('All');

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: attractions.length };
    for (const f of filters) {
      if (f === 'All') continue;
      map[f] = attractions.filter((a) => a.filter === f).length;
    }
    return map;
  }, []);

  const visible = useMemo(
    () => (active === 'All' ? attractions : attractions.filter((a) => a.filter === active)),
    [active]
  );

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <Seo
          title="Visit Mati"
          description="Two coasts, one city — Pacific surf at Dahican and the protected Pujada Bay. Where to go in Mati, when to come, and how to plan your trip."
          canonicalPath="/visit-mati"
        />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden bg-navy">
          <div className="absolute inset-0 -z-20">
            <ImageSlot
              src="/assets/images/banners/visit-mati-bg.jpg"
              eager
              alt=""
              label="Drop a wide hero photo — surfer on a Dahican wave"
            />
          </div>
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(18,60,122,0.94)_0%,rgba(18,60,122,0.78)_44%,rgba(18,60,122,0.35)_80%,rgba(18,60,122,0.2)_100%)]"
            aria-hidden="true"
          />
          <Container>
            <div className="grid min-h-[560px] items-center gap-10 py-14 md:py-16 lg:grid-cols-2">
              <m.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="text-white"
              >
                <m.nav
                  variants={fadeUp}
                  aria-label="Breadcrumb"
                  className="mb-6 flex items-center gap-2.5 text-[0.8125rem] text-white/80"
                >
                  <AppLink to="/" className="text-white/80 hover:text-white">
                    Home
                  </AppLink>
                  <ChevronRight className="size-2.5" aria-hidden="true" />
                  <span className="font-semibold text-white">Visit Mati</span>
                </m.nav>
                <m.img
                  variants={fadeUp}
                  src={FEEL_MATI_LOGO}
                  alt="Feel Mati"
                  className="h-auto w-[200px]"
                />
                <m.h1
                  variants={fadeUp}
                  className="mt-5 mb-3.5 font-display text-[2.25rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3rem] text-white"
                >
                  {hero.tagline}
                  <br />
                  <span className="text-amber">{hero.taglineAccent}</span>
                </m.h1>
                <m.p
                  variants={fadeUp}
                  className="max-w-[500px] text-[1.0625rem] leading-relaxed text-white/90"
                >
                  {hero.subtitle}
                </m.p>
                <m.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#plan"
                    className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-amber px-5 font-display text-[0.9375rem] font-bold text-navy transition hover:brightness-105"
                  >
                    Plan your trip
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="#places"
                    className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-white/10 px-5 font-display text-[0.9375rem] font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/15"
                  >
                    <MapPin className="size-3.5" aria-hidden="true" />
                    See all places
                  </a>
                </m.div>
              </m.div>

              {/* Conditions card — indicative sample data for layout. */}
              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="w-full max-w-[360px] justify-self-start overflow-hidden rounded-card border-t-[3px] border-amber bg-white shadow-[0_18px_44px_rgba(3,10,30,0.34)] lg:justify-self-end"
              >
                <div className="flex items-center justify-between px-[18px] pt-4 pb-3">
                  <div>
                    <div className="font-mono text-[0.6875rem] tracking-[0.09em] text-ink-muted">
                      {conditions.place.toUpperCase()}
                    </div>
                    <div className="mt-0.5 font-display text-[1.0625rem] font-extrabold text-heading">
                      {conditions.status}
                    </div>
                  </div>
                  {conditions.open ? (
                    <span className="inline-flex h-[22px] items-center gap-1.5 bg-[#e6f6ee] px-2.5 text-xs font-bold text-[#11704a]">
                      <span className="size-1.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                      Open
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-3 shadow-[inset_0_1px_0_var(--tone-line),inset_0_-1px_0_var(--tone-line)]">
                  {conditions.metrics.map((metric, i) => (
                    <div
                      key={metric.label}
                      className={`px-[18px] py-3.5 ${i > 0 ? 'shadow-[inset_1px_0_0_var(--tone-line)]' : ''}`}
                    >
                      <div className="text-xs text-ink-muted">{metric.label}</div>
                      <div className="mt-0.5 font-display text-xl font-extrabold text-heading">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2.5 px-[18px] py-[11px] text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Radio className="size-3" aria-hidden="true" />
                    Source: {conditions.source}
                  </span>
                  <span>{conditions.updated}</span>
                </div>
              </m.div>
            </div>
          </Container>
        </section>

        {/* ── Two coasts ───────────────────────────────────────────────────── */}
        <section className="bg-white py-14 md:py-16">
          <Container>
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="mb-8 max-w-[640px]"
            >
              <Eyebrow>Pick your side — or both</Eyebrow>
              <h2 className="mt-2.5 mb-2.5 font-display text-[2.25rem] font-extrabold tracking-[-0.03em] text-heading">
                The open Pacific, and the sheltered bay
              </h2>
              <p className="text-base leading-relaxed text-ink-muted">
                Mati sits on a peninsula. Its east shore takes the full Pacific swell; its west
                shore wraps around Pujada Bay, one of the calmest protected seascapes in Mindanao.
                Most visitors do both in one trip.
              </p>
            </m.div>
            <m.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="grid gap-5 lg:grid-cols-2"
            >
              {coasts.map((coast) => (
                <CoastCard key={coast.key} coast={coast} />
              ))}
            </m.div>
          </Container>
        </section>

        {/* ── Directory ────────────────────────────────────────────────────── */}
        <section id="places" className="bg-surface-subtle py-14 md:py-16">
          <Container>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <Eyebrow>{t('visit-places-to-go')}</Eyebrow>
                <h2 className="mt-2.5 font-display text-[2rem] font-extrabold tracking-[-0.03em] text-heading">
                  Where to go in Mati
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filters.map((f) => {
                  const isActive = f === active;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActive(f)}
                      aria-pressed={isActive}
                      className={
                        isActive
                          ? 'inline-flex h-[34px] items-center gap-1.5 rounded-lg bg-navy px-3.5 font-display text-[0.8125rem] font-bold text-white'
                          : 'inline-flex h-[34px] items-center gap-1.5 rounded-lg bg-white px-3.5 font-display text-[0.8125rem] font-semibold text-heading border border-line transition hover:bg-royal-tint'
                      }
                    >
                      {f}
                      <span
                        className={`font-mono text-[0.6875rem] ${isActive ? 'text-amber' : 'text-ink-muted'}`}
                      >
                        {counts[f]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <m.div
              key={active}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visible.map((a) => (
                <PlaceCard key={a.slug} a={a} />
              ))}
            </m.div>
          </Container>
        </section>

        {/* ── Season guide ─────────────────────────────────────────────────── */}
        <section className="bg-white py-14 md:py-16">
          <Container>
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="mb-6 flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <Eyebrow>{t('visit-when-to-come')}</Eyebrow>
                <h2 className="mt-2.5 font-display text-[2rem] font-extrabold tracking-[-0.03em] text-heading">
                  A year on the water
                </h2>
              </div>
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[#fff6d9] px-2.5 text-xs font-semibold text-feel-text ring-1 ring-[#f5d36b] ring-inset">
                <Info className="size-3" aria-hidden="true" />
                Indicative — to verify with City Tourism Office
              </span>
            </m.div>
            <div className="overflow-x-auto rounded-card border border-line">
              <div
                className="min-w-[760px]"
                style={{ display: 'grid', gridTemplateColumns: '200px repeat(12, minmax(0, 1fr))' }}
              >
                <div className="bg-surface-subtle px-4 py-3 shadow-[inset_0_-1px_0_var(--tone-line)]" />
                {months.map((mo) => (
                  <div
                    key={mo}
                    className="bg-surface-subtle py-3 text-center font-mono text-[0.6875rem] font-semibold tracking-[0.05em] text-ink-muted shadow-[inset_0_-1px_0_var(--tone-line)]"
                  >
                    {mo}
                  </div>
                ))}
                {seasons.map((row) => {
                  const Icon = SEASON_ICONS[row.icon] ?? Waves;
                  return (
                    <div key={row.label} className="contents">
                      <div className="flex items-center gap-2.5 px-4 py-3.5 font-display text-sm font-bold text-heading shadow-[inset_0_-1px_0_var(--tone-line)]">
                        <Icon className="size-4 text-royal" aria-hidden="true" />
                        {row.label}
                      </div>
                      {row.cells.map((state, i) => (
                        <div
                          key={`${row.label}-${i}`}
                          className="flex items-center px-0.5 py-3.5 shadow-[inset_0_-1px_0_var(--tone-line)]"
                        >
                          <div
                            className={`h-3 w-full rounded-none ${seasonBarClass(state)} ${
                              state === 'off' ? 'ring-1 ring-line ring-inset' : ''
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-4 text-[0.8125rem] text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-[18px] rounded-none bg-amber" aria-hidden="true" />
                Best
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-[18px] rounded-none bg-royal" aria-hidden="true" />
                Good
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-2.5 w-[18px] rounded-none bg-surface-subtle ring-1 ring-line ring-inset"
                  aria-hidden="true"
                />
                Off-season
              </span>
            </div>
          </Container>
        </section>

        {/* ── Sambuokan ────────────────────────────────────────────────────── */}
        <section className="bg-amber">
          <Container>
            <m.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="grid items-center gap-10 py-14 lg:grid-cols-2"
            >
              <m.div variants={fadeUp} className="text-navy">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.09em] uppercase">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {sambuokan.when}
                </div>
                <h2 className="mt-3 mb-3 font-display text-[2rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-navy md:text-5xl">
                  {sambuokan.title}
                </h2>
                <p className="mb-6 max-w-[480px] text-base leading-relaxed text-navy">
                  {sambuokan.blurb}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="inline-flex h-11 items-center gap-2 rounded-btn bg-navy px-5 font-display text-[0.9375rem] font-bold text-white transition hover:brightness-110"
                  >
                    Festival schedule
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-11 items-center gap-2 rounded-btn border-[1.5px] border-navy px-5 font-display text-[0.9375rem] font-semibold text-navy transition hover:bg-navy/5"
                  >
                    <CalendarPlus className="size-3.5" aria-hidden="true" />
                    Add to calendar
                  </a>
                </div>
              </m.div>
              <m.div
                variants={fadeUp}
                className="relative aspect-[4/3] overflow-hidden rounded-card bg-[#f0b400] shadow-[0_18px_40px_rgba(18,60,122,0.22)]"
              >
                <PhotoSlot
                  photo={sambuokanPhoto}
                  label={sambuokan.imageLabel}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                {sambuokanPhoto ? (
                  <PhotoCredit
                    photo={sambuokanPhoto}
                    className="absolute right-2 bottom-2 bg-black/55 px-1.5 py-0.5 text-white"
                  />
                ) : null}
              </m.div>
            </m.div>
          </Container>
        </section>

        {/* ── Plan ─────────────────────────────────────────────────────────── */}
        <section id="plan" className="bg-white py-14 md:py-16">
          <Container>
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="mb-7 max-w-[640px]"
            >
              <Eyebrow>{t('visit-plan-your-trip')}</Eyebrow>
              <h2 className="mt-2.5 font-display text-[2rem] font-extrabold tracking-[-0.03em] text-heading">
                Getting here, getting around
              </h2>
            </m.div>
            <m.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {plan.map((card) => {
                const Icon = PLAN_ICONS[card.icon] ?? Info;
                return (
                  <m.div
                    key={card.title}
                    variants={fadeUp}
                    className="flex flex-col gap-3 rounded-card bg-white p-[22px] border border-line"
                  >
                    <span className="flex size-10 items-center justify-center rounded-card bg-royal-tint text-royal">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-[1.0625rem] font-extrabold text-heading">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{card.body}</p>
                    {card.linkLabel ? (
                      <a
                        href="#"
                        className="mt-auto inline-flex items-center gap-1.5 font-display text-sm font-bold text-royal"
                      >
                        {card.linkLabel}
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </a>
                    ) : null}
                  </m.div>
                );
              })}
              <m.div
                variants={fadeUp}
                className="flex flex-col gap-3 rounded-card bg-navy p-[22px] text-white"
              >
                <span className="flex size-10 items-center justify-center rounded-card bg-amber/15 text-amber">
                  <ShieldCheck className="size-[18px]" aria-hidden="true" />
                </span>
                <h3 className="font-display text-[1.0625rem] font-extrabold text-white">
                  {responsible.title}
                </h3>
                <ul className="grid gap-1.5 pl-[18px] text-sm leading-snug text-white/90 [list-style:disc]">
                  {responsible.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </m.div>
            </m.div>

            {/* Tourism office assistance bar */}
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-card border border-line bg-surface-subtle px-[22px] py-[18px]"
            >
              <div className="flex items-center gap-3.5">
                <HandHelping className="size-[22px] text-royal" aria-hidden="true" />
                <div>
                  <div className="font-display text-[0.9375rem] font-bold text-heading">
                    {tourismOffice.name}
                  </div>
                  <div className="text-[0.8125rem] text-ink-muted">{tourismOffice.hours}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[#fff6d9] px-2.5 text-xs font-semibold text-feel-text ring-1 ring-[#f5d36b] ring-inset">
                  <Info className="size-3" aria-hidden="true" />
                  {tourismOffice.phoneNote}
                </span>
                <AppLink
                  to="/contact"
                  className="inline-flex h-[38px] items-center gap-2 rounded-btn bg-royal px-4 font-display text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Flag className="size-3.5" aria-hidden="true" />
                  Report a tourism concern
                </AppLink>
              </div>
            </m.div>
          </Container>
        </section>

        {/* ── Photo credits ────────────────────────────────────────────────── */}
        <PhotoCredits />
      </MotionConfig>
    </LazyMotion>
  );
}

// Every photo on this page, with who published it, where, and on what terms. Cards carry
// only the short credit; the links live here so a card that is itself a link stays valid.
function PhotoCredits() {
  const { t } = useLanguage();
  return (
    <section
      id="photo-credits"
      aria-labelledby="photo-credits-heading"
      className="border-t border-line bg-surface-subtle py-12"
    >
      <Container>
        <div className="max-w-[720px]">
          <Eyebrow>{t('visit-photos-eyebrow')}</Eyebrow>
          <h2
            id="photo-credits-heading"
            className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.03em] text-heading"
          >
            {t('visit-photos-title')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('visit-photos-lede')}</p>
        </div>
        <ul className="mt-6 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {photos.map((photo) => (
            <li key={photo.id} className="flex gap-4 bg-white p-4">
              <img
                src={photo.srcSmall}
                alt=""
                width={96}
                height={Math.round((96 * photo.height) / photo.width)}
                loading="lazy"
                decoding="async"
                className="h-16 w-24 shrink-0 object-cover"
              />
              <div className="min-w-0 text-[0.8125rem] leading-snug">
                <p className="text-heading">{photo.alt}</p>
                <p className="mt-1 font-semibold text-heading">
                  <PhotoCredit photo={photo} className="text-[0.8125rem]" />
                  {photo.licenseUrl ? (
                    <>
                      {' · '}
                      <a
                        href={photo.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-normal text-royal hover:underline"
                      >
                        {t('visit-photos-license')}
                      </a>
                    </>
                  ) : null}
                </p>
                <ul className="mt-1 space-y-0.5">
                  {photo.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-royal hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {photo.note ? <p className="mt-1 text-ink-muted">{photo.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[860px] text-xs leading-relaxed text-ink-muted">
          {t('visit-photos-terms')}
        </p>
      </Container>
    </section>
  );
}
