import { ArrowRight, HardHat } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { AppLink } from '@/components/AppLink';
import { useLanguage } from '@/hooks/useLanguage';
import { Band, Container, PageHeader } from '@/components/primitives';
import { ProjectLedger } from '@/components/ProjectLedger';
import { ProjectMap } from '@/components/ProjectMap';
import { AwardedWorksTable } from '@/components/AwardedWorksTable';
import { awardedWorks } from '@/lib/awardedWorks';
import { ProcurementTable } from '@/components/ProcurementTable';
import { formatChangeDate } from '@/lib/changelog';
import { procurementCheckedOn, procurementNotices } from '@/lib/infrastructureData';
import { risingProjects } from '@/lib/risingProjects';

// Projects and procurement, after BetterSanFernando's /projects/city-projects and
// /procurement/bid-results: a barangay map of project records (#project-map), a searchable
// list of the major projects (#rising-in-mati, linked from the homepage), the City's
// awarded civil works (#awarded-works) and a searchable table of procurement notices.
export default function Projects() {
  const { t, language } = useLanguage();

  return (
    <>
      <Seo
        title={t('projects-page-name')}
        description="Major projects in Mati and the City's procurement notices, searchable and each linked to its official source."
        canonicalPath="/transparency/projects"
      />

      <PageHeader
        badge={
          <>
            <HardHat className="size-4" aria-hidden="true" />
            {t('projects-eyebrow')}
          </>
        }
        breadcrumb={[
          { label: t('nav-home'), to: '/' },
          { label: t('nav-transparency'), to: '/transparency' },
          { label: t('projects-page-name') },
        ]}
        title={t('projects-page-name')}
        description={t('projects-lede')}
        meta={[
          t('projects-major-count', { count: risingProjects.length }),
          t('works-count', { count: awardedWorks.length }),
          t('projects-notice-count', { count: procurementNotices.length }),
          t('projects-checked-on', { date: formatChangeDate(procurementCheckedOn, language) }),
        ]}
      />

      <Band id="project-map" eyebrow={t('map-eyebrow')} title={t('map-title')} lede={t('map-lede')}>
        <ProjectMap />
      </Band>

      <Band
        id="rising-in-mati"
        eyebrow={t('projects-ledger-eyebrow')}
        title={t('rising-title')}
        lede={t('rising-note')}
      >
        <ProjectLedger />
      </Band>

      <Band
        id="awarded-works"
        eyebrow={t('works-eyebrow')}
        title={t('works-title')}
        lede={t('works-lede')}
      >
        <AwardedWorksTable />
      </Band>

      <Band
        id="procurement"
        eyebrow={t('projects-notices-eyebrow')}
        title={t('projects-notices-title')}
        lede={t('projects-notices-lede')}
      >
        <ProcurementTable />
      </Band>

      <section className="border-b border-line bg-white py-10">
        <Container className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <AppLink
            to="/transparency/finance"
            className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
          >
            {t('finance-page-name')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </AppLink>
          <AppLink
            to="/transparency/sources"
            className="inline-flex items-center gap-1 font-semibold text-royal hover:underline"
          >
            {t('sources-see-all')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </AppLink>
        </Container>
      </section>
    </>
  );
}
