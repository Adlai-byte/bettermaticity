import { useState } from 'react';
import { ArrowUpRight, Building2, ChevronRight, Phone } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { DirectoryList } from '@/components/DirectoryList';
import { OfficialChannels } from '@/components/OfficialChannels';
import { useLanguage } from '@/hooks/useLanguage';
import { Container, PageHeader, Section, SectionHead } from '@/components/primitives';
import { formatChangeDate } from '@/lib/changelog';
import {
  cityOfficeCount,
  cityOfficeGroups,
  cityOfficesCheckedOn,
  cityOfficesSource,
  departments,
  type GovDepartment,
} from '@/lib/govDirectory';

const withGuide = departments.filter((d) => d.to.startsWith('/service-details/')).length;
const withHotline = departments.filter((d) => d.verifiedPhone).length;

// City office directory in BetterSanFernando's /government/offices style: the offices
// with a service guide first, then the City's full list of departments and offices. Only
// phone numbers from a sourced dataset are shown; the rest defer to the office.
export default function GovernmentOffices() {
  const { t, language } = useLanguage();
  const name = (d: GovDepartment) => (d.titleKey ? t(d.titleKey) : (d.title ?? ''));
  // Client-only filter; starts empty so every office is in the prerendered HTML.
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = q
    ? departments.filter((d) => `${name(d)} ${t(d.descKey)}`.toLowerCase().includes(q))
    : departments;

  return (
    <>
      <Seo
        title={t('gov-offices-title')}
        description="City of Mati offices and the services each one handles."
        canonicalPath="/government/offices"
      />

      <PageHeader
        badge={
          <>
            <Building2 className="size-4" aria-hidden="true" />
            {t('gov-offices-eyebrow')}
          </>
        }
        title={t('gov-offices-title')}
        description={t('gov-offices-lede')}
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-government'), to: '/government' },
          { label: t('gov-link-offices') },
        ]}
        aside={{ label: t('gov-offices-about-label'), body: t('gov-offices-about-body') }}
        stats={[
          {
            label: t('gov-stat-offices'),
            value: cityOfficeCount,
            caption: t('gov-stat-offices-caption', { count: cityOfficeGroups.length }),
          },
          {
            label: t('gov-stat-guides'),
            value: withGuide,
            caption: t('gov-stat-of', { total: cityOfficeCount }),
          },
          {
            label: t('gov-stat-hotline'),
            value: withHotline,
            caption: t('gov-stat-of', { total: cityOfficeCount }),
          },
        ]}
      />

      <Section>
        <Container>
          <DirectoryList
            id="offices"
            eyebrow={t('gov-offices-dir-eyebrow')}
            title={t('gov-offices-find')}
            help={t('gov-offices-help')}
            items={visible}
            total={departments.length}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder={t('gov-offices-search')}
            emptyText={t('gov-offices-empty')}
            getKey={(d) => (d.titleKey ?? d.title ?? '') + d.descKey}
            renderItem={(d) => (
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem_auto] md:items-start md:gap-8">
                <div className="flex min-w-0 items-start gap-3">
                  <d.Icon className="mt-0.5 size-5 shrink-0 text-royal" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-heading">{name(d)}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{t(d.descKey)}</p>
                  </div>
                </div>
                <div className="text-sm md:pt-0.5">
                  {d.verifiedPhone ? (
                    <a
                      href={`tel:${d.tel}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-heading hover:text-royal"
                    >
                      <Phone className="size-4 text-ink-faint" aria-hidden="true" />
                      {d.phone}
                      <span className="sr-only">({t('gov-verified-hotline')})</span>
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-feel-text">
                      {t('service-confirm-office')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-1 text-sm md:items-end md:pt-0.5">
                  <AppLink
                    to={d.to}
                    className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
                  >
                    {t('gov-view-services')}
                    <span className="sr-only">: {name(d)}</span>
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </AppLink>
                  {d.jobUrl ? (
                    <a
                      href={d.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-royal"
                    >
                      {t('gov-view-job-vacancies')}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only"> ({t('service-new-tab')})</span>
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          />
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <SectionHead
            id="all-offices"
            eyebrow={t('gov-offices-all-eyebrow')}
            title={t('gov-offices-all-title')}
            lede={t('gov-offices-all-lede', {
              count: cityOfficeCount,
              groups: cityOfficeGroups.length,
            })}
          />
          <ul className="grid grid-cols-1 border-t border-l border-line md:grid-cols-2 lg:grid-cols-3">
            {cityOfficeGroups.map((g) => (
              <li key={g.name} className="border-r border-b border-line p-5">
                <h3 className="text-sm font-bold text-heading">{g.name}</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-ink-muted">
                  {g.offices.map((o) => (
                    <li key={o.name}>{o.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-ink-muted">
            {t('gov-offices-all-source')}{' '}
            <a
              href={cityOfficesSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-royal hover:underline"
            >
              {cityOfficesSource.title}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> ({t('service-new-tab')})</span>
            </a>
            {' · '}
            {t('projects-checked-on', {
              date: formatChangeDate(cityOfficesCheckedOn, language, 'medium'),
            })}
          </p>
        </Container>
      </Section>

      <OfficialChannels />
    </>
  );
}
