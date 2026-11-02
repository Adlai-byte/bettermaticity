import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleHelp,
  Info,
  MapPin,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { PhotoCredit, PhotoSlot } from '@/components/PhotoSlot';
import { Breadcrumb, Container, Section } from '@/components/primitives';
import { useLanguage } from '@/hooks/useLanguage';
import {
  featuredAttractions,
  getAttraction,
  getPhoto,
  readFact,
  readSection,
  responsible,
  tourismOffice,
  type Attraction,
} from '@/lib/tourismData';
import { cn } from '@/lib/utils';

// OpenStreetMap embed centred on the attraction (same approach as Home's map).
function osmEmbed(lat: number, lng: number): string {
  const d = 0.03;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

const osmPage = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`;

/** One "at a glance" fact; bracketed feed values ("[Hours & fees to verify]") are flagged. */
function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const fact = readFact(value);
  return (
    <div className="flex gap-3 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
      <div>
        <dt className="text-xs text-ink-faint">{label}</dt>
        <dd className={cn('text-sm', fact.toVerify ? 'text-ink-muted italic' : 'text-heading')}>
          {fact.text}
        </dd>
      </div>
    </div>
  );
}

/** Other attractions with pages: the same side of the city first, then the rest. */
function morePlaces(a: Attraction): Attraction[] {
  const others = featuredAttractions.filter((o) => o.slug !== a.slug);
  return [
    ...others.filter((o) => o.coast === a.coast),
    ...others.filter((o) => o.coast !== a.coast),
  ];
}

/**
 * Shared renderer for a single Visit Mati attraction, resolved from the tourism
 * feed by slug. Mirrors the service-details/* -> ServiceGuide delegation pattern:
 * each attraction page is a one-liner that calls <AttractionDetail slug="..." />.
 *
 * The photo leads: shown nearly clear, with the name on a white plate set into its lower
 * edge. Sections the feed still marks as placeholders say so, and list what is missing,
 * instead of printing editor notes.
 */
export function AttractionDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const a = getAttraction(slug);
  const photo = getPhoto(a?.photo);

  if (!a) {
    return (
      <Section>
        <Container>
          <p className="text-ink-muted">{t('attraction-not-found')}</p>
          <AppLink to="/visit-mati" className="mt-4 inline-block text-royal underline">
            {t('attraction-back')}
          </AppLink>
        </Container>
      </Section>
    );
  }

  const sections = a.sections.map((s) => ({ heading: s.heading, ...readSection(s.body) }));

  return (
    <>
      <Seo
        title={`${a.name} · Visit Mati`}
        description={a.blurb}
        canonicalPath={`/visit-mati/${a.slug}`}
        type="article"
      />

      <Container>
        <Breadcrumb
          className="py-4"
          items={[
            { label: t('nav-home'), to: '/' },
            { label: t('nav-visit-mati'), to: '/visit-mati' },
            { label: a.name },
          ]}
        />
      </Container>

      {/* ── Photo ────────────────────────────────────────────────────────── */}
      <div className="relative h-[42vh] min-h-[280px] bg-navy sm:h-[56vh] sm:max-h-[620px]">
        <PhotoSlot photo={photo} label={a.imageLabel} sizes="100vw" eager />
      </div>

      {/* ── Title plate + at a glance ────────────────────────────────────── */}
      <Container>
        <div className="grid gap-x-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="relative -mt-12 border border-line bg-white p-6 shadow-[0_18px_40px_rgba(18,60,122,0.14)] sm:-mt-20 sm:p-8">
            {a.badge ? (
              <span className="mb-3 inline-flex h-6 items-center bg-amber px-2.5 text-xs font-bold text-navy">
                {a.badge}
              </span>
            ) : null}
            <h1 className="font-display text-[2.25rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-balance text-heading sm:text-5xl">
              {a.name}
            </h1>
            <p className="mt-3 max-w-[48ch] text-lg leading-relaxed text-ink-soft">{a.tagline}</p>
            {photo ? (
              <p className="mt-5 flex flex-wrap items-center gap-x-2 text-ink-faint">
                <PhotoCredit photo={photo} className="text-xs" />
                <a
                  href={photo.sources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-xs text-royal hover:underline"
                >
                  {t('photo-source')}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                  <span className="sr-only"> ({t('service-new-tab')})</span>
                </a>
              </p>
            ) : null}
          </div>
          <dl className="mt-6 divide-y divide-line self-end border-y border-line lg:mt-0">
            <Fact icon={MapPin} label={t('attraction-where')} value={a.where} />
            <Fact icon={Info} label={t('attraction-good-to-know')} value={a.note} />
            <Fact icon={Tag} label={t('attraction-type')} value={a.category} />
          </dl>
        </div>
      </Container>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="max-w-[68ch]">
              <p className="text-xl leading-relaxed text-heading">{a.blurb}</p>

              <h2 className="mt-10 font-display text-xl font-bold tracking-[-0.02em] text-heading">
                {t('attraction-known-for')}
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {a.highlights.map((h) => (
                  <li
                    key={h}
                    className="border-t-2 border-royal pt-3 text-sm leading-snug text-ink"
                  >
                    <Check className="mb-1.5 size-4 text-royal" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              {sections.map((s) => (
                <section key={s.heading} className="mt-10">
                  <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl font-bold tracking-[-0.02em] text-heading">
                    {s.heading}
                    {s.confirmed ? null : (
                      <span className="inline-flex h-6 items-center rounded-full bg-[#fff6d9] px-2.5 font-sans text-xs font-semibold tracking-normal text-feel-text ring-1 ring-[#f5d36b] ring-inset">
                        {t('attraction-unconfirmed')}
                      </span>
                    )}
                  </h2>
                  {s.text ? <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p> : null}
                  {s.toConfirm.length ? (
                    <div className="mt-3 border-l-2 border-amber bg-surface-subtle px-4 py-3 text-sm leading-relaxed text-ink-soft">
                      <p>
                        <span className="font-semibold text-heading">
                          {t('attraction-still-to-confirm')}
                        </span>{' '}
                        {s.toConfirm.join('; ')}.
                      </p>
                      <AppLink
                        to="/contact"
                        className="mt-1 inline-flex items-center gap-1 font-semibold text-royal hover:underline"
                      >
                        {t('attraction-ask-office')}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </AppLink>
                    </div>
                  ) : null}
                </section>
              ))}

              <p className="mt-10 flex gap-2 text-sm leading-relaxed text-ink-muted">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                {t('attraction-draft-note')}
              </p>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-[calc(var(--sticky-offset)+1.5rem)] lg:self-start">
              {a.coords ? (
                <div className="border border-line bg-white">
                  <h2 className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-heading">
                    <MapPin className="size-4 text-royal" aria-hidden="true" />
                    {t('attraction-map')}
                  </h2>
                  <iframe
                    title={t('attraction-map-title', { name: a.name })}
                    className="block h-56 w-full border-0"
                    loading="lazy"
                    src={osmEmbed(a.coords.lat, a.coords.lng)}
                  />
                  <a
                    href={osmPage(a.coords.lat, a.coords.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 border-t border-line px-4 py-2.5 text-sm font-semibold text-royal hover:underline"
                  >
                    {t('attraction-map-open')}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only"> ({t('service-new-tab')})</span>
                  </a>
                </div>
              ) : null}

              <div className="border border-line bg-white p-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-heading">
                  <ShieldCheck className="size-4 text-royal" aria-hidden="true" />
                  {t('attraction-before-you-go')}
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-snug text-ink-soft">
                  {responsible.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-ink-faint">
                        –
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-navy p-4 text-white">
                <h2 className="text-sm font-bold">{t('attraction-office-title')}</h2>
                <p className="mt-1 text-sm leading-snug text-white/80">{tourismOffice.name}</p>
                <p className="text-sm leading-snug text-white/80">{tourismOffice.hours}</p>
                <AppLink
                  to="/contact"
                  className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-btn bg-amber px-3.5 text-sm font-bold text-navy transition hover:brightness-105"
                >
                  {t('attraction-office-contact')}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </AppLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ── More places ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="more-places-heading"
        className="border-t border-line bg-surface-subtle py-12 md:py-14"
      >
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="more-places-heading"
              className="font-display text-2xl font-extrabold tracking-[-0.03em] text-heading"
            >
              {t('attraction-more-title')}
            </h2>
            <AppLink
              to="/visit-mati#places"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
            >
              {t('attraction-more-all')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </AppLink>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {morePlaces(a).map((o) => {
              const p = getPhoto(o.photo);
              return (
                <li key={o.slug}>
                  <AppLink
                    to={`/visit-mati/${o.slug}`}
                    className="group flex h-full flex-col border border-line bg-white transition-colors hover:border-royal"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <PhotoSlot
                        photo={p}
                        label={o.imageLabel}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        decorative
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <span className="font-display font-extrabold text-heading group-hover:text-royal">
                        {o.name}
                      </span>
                      <span className="text-sm leading-snug text-ink-muted">{o.tagline}</span>
                      {p ? <PhotoCredit photo={p} className="mt-auto pt-2 text-ink-faint" /> : null}
                    </div>
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
