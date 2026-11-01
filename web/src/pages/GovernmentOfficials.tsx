import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { DirectoryList } from '@/components/DirectoryList';
import { OfficialChannels } from '@/components/OfficialChannels';
import { useLanguage } from '@/hooks/useLanguage';
import { Container, PageHeader, Section, SectionHead } from '@/components/primitives';
import { officials, type Official } from '@/lib/govData';
import { officialInitials } from '@/lib/utils';

const councilors = (officials.councilors ?? []).map((c, i) => ({ ...c, rank: i + 1 }));
const executives = [officials.mayor, officials.vice_mayor].filter((o): o is Official => !!o);

const councilPhoto = officials._councilPhoto;

function Avatar({ name, image, large = false }: { name: string; image?: string; large?: boolean }) {
  if (image)
    return (
      <img
        src={image}
        alt=""
        width={large ? 64 : 40}
        height={large ? 64 : 40}
        className={
          large
            ? 'size-16 shrink-0 rounded-full bg-royal-tint object-cover'
            : 'size-10 shrink-0 rounded-full bg-royal-tint object-cover'
        }
      />
    );
  return (
    <span
      aria-hidden="true"
      className={
        large
          ? 'flex size-16 shrink-0 items-center justify-center rounded-full bg-royal-tint font-display text-lg font-bold text-royal'
          : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-royal-tint font-display text-sm font-bold text-royal'
      }
    >
      {officialInitials(name)}
    </span>
  );
}

// Elected officials in BetterSanFernando's directory style. Names and councilor order come
// from mati.gov.ph (cited through archived copies). The only photos are the City's own: the
// Mayor's portrait (cropped from the banner on his page) and an unlabelled council group
// photo, shown whole. Everyone else keeps initials; no face is matched to a name by guess.
export default function GovernmentOfficials() {
  const { t } = useLanguage();
  // Client-only filter; starts empty so all councilors are in the prerendered HTML.
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = q ? councilors.filter((c) => c.name.toLowerCase().includes(q)) : councilors;

  return (
    <>
      <Seo
        title={t('officials-elected-officials')}
        description="The mayor, vice mayor and Sangguniang Panlungsod members of the City of Mati, 2025–2028 term."
        canonicalPath="/government/officials"
      />

      <PageHeader
        badge={
          <>
            <UserRound className="size-4" aria-hidden="true" />
            {t('gov-officials-eyebrow')}
          </>
        }
        title={t('officials-elected-officials')}
        description={t('gov-officials-lede')}
        note={t('gov-officials-note')}
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-government'), to: '/government' },
          { label: t('officials-elected-officials') },
        ]}
        aside={{ label: t('gov-officials-about-label'), body: t('gov-officials-about-body') }}
        stats={[
          { label: t('gov-stat-officials'), value: executives.length + councilors.length },
          { label: t('gov-stat-councilors'), value: councilors.length },
          { label: t('gov-stat-term'), value: t('gov-term-value') },
        ]}
      />

      <Section>
        <Container>
          <SectionHead eyebrow={t('gov-executive-branch')} title={t('gov-executive-title')} />
          <ul className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {executives.map((o) => (
              <li key={o.name} className="flex items-start gap-5 bg-white p-6">
                <Avatar name={o.name} image={o.image} large />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-royal uppercase">
                    {o.title}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-heading">{o.name}</h3>
                  <p className="mt-3 text-sm text-ink-muted">
                    <AppLink to="/contact" className="font-semibold text-royal hover:underline">
                      {t('service-contact-link')}
                    </AppLink>
                  </p>
                  {o.imageSource ? (
                    <p className="mt-2 text-[0.6875rem] leading-4 text-ink-faint">
                      {t('gov-photo-credit')}{' '}
                      <a
                        href={o.imageSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-royal"
                      >
                        {t('gov-photo-source')}
                      </a>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <DirectoryList
            id="councilors"
            eyebrow={t('gov-legislative-branch')}
            title={t('gov-sb-members')}
            help={t('gov-sp-help')}
            items={visible}
            total={councilors.length}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder={t('gov-sp-search')}
            emptyText={t('gov-sp-empty')}
            getKey={(c) => c.name}
            renderItem={(c) => (
              <div className="flex items-center gap-4">
                <span className="w-6 shrink-0 font-mono text-xs font-semibold text-ink-faint">
                  {String(c.rank).padStart(2, '0')}
                </span>
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-heading">{c.name}</h3>
                  <p className="text-sm text-ink-muted">{c.title}</p>
                </div>
              </div>
            )}
          />
          {councilPhoto ? (
            <figure className="mt-10 border border-line bg-white">
              <img
                src={councilPhoto.src}
                srcSet={`${councilPhoto.srcSmall} 800w, ${councilPhoto.src} 1600w`}
                sizes="(min-width: 1280px) 1200px, 100vw"
                width={councilPhoto.width}
                height={councilPhoto.height}
                alt={councilPhoto.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-xs leading-5 text-ink-muted">
                <span className="font-semibold text-heading">{t('gov-council-photo-title')}</span>{' '}
                {t('gov-council-photo-caption')}{' '}
                <a
                  href={councilPhoto.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-royal"
                >
                  {t('gov-photo-source')}
                </a>
              </figcaption>
            </figure>
          ) : null}
        </Container>
      </Section>

      <OfficialChannels />
    </>
  );
}
