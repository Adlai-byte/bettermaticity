import { Newspaper, ArrowRight, ExternalLink } from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa6';
import { Seo } from '@/components/Seo';
import { useLanguage } from '@/hooks/useLanguage';
import { Band, Container, Section, PageHeader } from '@/components/primitives';
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  fadeUp,
  staggerContainer,
  revealViewport,
} from '@/components/motion';
import { useNews, formatNewsDate, safeNewsUrl, type NewsBadge } from '@/hooks/useNews';

const badgeClass: Record<NewsBadge, string> = {
  info: 'bg-royal-tint text-royal',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-feel-tint text-feel-text',
};

export default function News() {
  const { t } = useLanguage();
  const { items, loading } = useNews();

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <Seo
          title={t('news-news-updates')}
          description="Latest news, advisories, and announcements from the City of Mati."
          canonicalPath="/news"
        />

        <PageHeader
          badge={
            <>
              <Newspaper className="size-3.5" aria-hidden="true" />
              {t('news-news-updates')}
            </>
          }
          breadcrumb={[{ label: t('nav-home'), to: '/' }, { label: t('news-news-updates') }]}
          title={t('news-news-updates')}
          description={t('news-updates-subtitle')}
        />

        <Section className="border-b border-line">
          <Container>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-44 animate-pulse rounded-card bg-royal-tint" />
                ))}
              </div>
            ) : items && items.length > 0 ? (
              <m.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((a) => {
                  const url = safeNewsUrl(a.url);
                  return (
                    <m.article
                      key={a.id}
                      variants={fadeUp}
                      className="flex flex-col rounded-card bg-white p-6 border border-line"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 text-[0.6875rem] font-bold tracking-wider uppercase ${badgeClass[a.badge] ?? badgeClass.info}`}
                        >
                          {a.category}
                        </span>
                        <span className="font-mono text-[0.6875rem] text-ink-muted">
                          {formatNewsDate(a.date)}
                        </span>
                      </div>
                      <h3 className="mb-2 font-display text-base font-bold text-heading">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-royal"
                          >
                            {a.title}
                          </a>
                        ) : (
                          a.title
                        )}
                      </h3>
                      <p className="mb-4 flex-1 text-sm text-ink-muted">{a.summary}</p>
                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
                        >
                          {a.source || t('news-read-more')}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </a>
                      )}
                    </m.article>
                  );
                })}
              </m.div>
            ) : (
              <div className="rounded-card bg-white p-10 text-center border border-line">
                <Newspaper className="mx-auto mb-3 size-8 text-ink-muted" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-heading">
                  {t('news-no-updates-yet')}
                </h3>
                <p className="text-sm text-ink-muted">{t('news-check-back')}</p>
              </div>
            )}
          </Container>
        </Section>

        {/* From our Facebook Page */}
        <Band
          id="facebook"
          eyebrow={t('news-page-facebook-eyebrow')}
          title={t('news-from-our-facebook')}
          lede={t('news-latest-posts')}
          last
        >
          <div className="mt-6 max-w-[500px] overflow-hidden border border-line">
            <iframe
              title="LGU Mati Facebook"
              className="h-[500px] w-full"
              loading="lazy"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmaticitylgu%2F&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
            />
          </div>
          <a
            href="https://www.facebook.com/maticitylgu/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
          >
            <FaFacebookF className="size-3.5" aria-hidden="true" />
            {t('news-visit-facebook')}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </Band>
      </MotionConfig>
    </LazyMotion>
  );
}
