import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaDiscord, FaGithub } from 'react-icons/fa6';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/primitives';
import { AppLink } from '@/components/AppLink';
// Imported at build time (build.sh bumps it before the Vite build), so the version is
// baked into every prerendered page; a runtime fetch was served stale by sw.js.
import siteVersion from '../../../../version.json';

const REPO = 'https://github.com/kaarlosasiang/bettermaticity';
const BUILDER = { name: 'Kaarlo Sasiang & Team', href: 'https://kaarlosasiang.vercel.app/' };

const social = [
  { Icon: FaFacebookF, href: 'https://www.facebook.com/bettermati.org', label: 'Facebook' },
  { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/bettermati/', label: 'LinkedIn' },
  { Icon: FaDiscord, href: 'https://discord.com/invite/qeSu7RJkjQ', label: 'Discord' },
  { Icon: FaGithub, href: REPO, label: 'GitHub' },
];

// [href, i18n key]. Absolute URLs open in a new tab; #hash links are plain <a> so a
// full load lands on the anchor.
const explore: [string, string][] = [
  ['/services', 'nav-services'],
  ['/government', 'nav-government'],
  ['/transparency', 'nav-transparency'],
  ['/statistics', 'nav-statistics'],
  ['/visit-mati', 'nav-visit-mati'],
  ['/about', 'nav-about'],
];

const publicInfo: [string, string][] = [
  ['/government/offices', 'gov-link-offices'],
  ['/contact', 'gov-link-contact'],
  ['/contact#hotlines', 'gov-channels-hotlines'],
  ['/government/barangays', 'gov-link-barangays'],
  ['/government/links', 'links-title'],
  ['/transparency/documents', 'docs-page-name'],
  ['/transparency/sources', 'sources-page-name'],
];

const legal: [string, string][] = [
  ['/sitemap', 'footer-sitemap'],
  ['/accessibility', 'footer-accessibility'],
  ['/privacy', 'footer-privacy'],
  ['/terms', 'footer-terms'],
  ['/changelog', 'footer-changelog'],
];

const eyebrowClass =
  'font-mono text-[0.6875rem] leading-normal font-medium tracking-[0.18em] text-neutral-200 uppercase';
const linkClass = 'text-sm text-neutral-300 transition-colors hover:text-white';

function FooterLink({
  to,
  className,
  children,
}: {
  to: string;
  className: string;
  children: ReactNode;
}) {
  if (to.startsWith('http'))
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  if (to.includes('#'))
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  return (
    <AppLink to={to} className={className}>
      {children}
    </AppLink>
  );
}

function LinkColumn({ title, links }: { title: string; links: [string, string][] }) {
  const { t } = useLanguage();
  return (
    <nav aria-label={title}>
      <p className={eyebrowClass}>{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map(([to, key]) => (
          <li key={key}>
            <FooterLink to={to} className={linkClass}>
              {t(key)}
              {to.startsWith('http') && (
                <ArrowUpRight className="ml-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
              )}
            </FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Site footer, laid out like BetterSanFernando's: brand + social, two link columns,
// a BetterGov.ph column, then a hairline and the copyright / legal row.
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-[linear-gradient(180deg,var(--color-footer-from)_0%,var(--color-footer-to)_100%)] text-white">
      <Container className="pt-14 pb-10 lg:pb-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <img
              src="/assets/images/logo/better-mati-logo-white.png"
              alt="BetterMati.org"
              width={230}
              height={72}
              className="h-auto w-[230px] max-w-full"
            />
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-300">
              {t('footer-about')}{' '}
              <span className="font-medium text-neutral-200">{t('footer-not-official')}</span>
            </p>
            <div className="mt-5 flex items-center gap-2">
              {social.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-btn border border-white/15 text-neutral-300 transition-colors hover:border-royal hover:text-white"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title={t('footer-explore')} links={explore} />
          <LinkColumn title={t('footer-public-info')} links={publicInfo} />

          {/* BetterGov.ph */}
          <div>
            <p className={eyebrowClass}>{t('footer-bettergov-eyebrow')}</p>
            <div className="mt-4 flex items-center gap-2">
              <img
                src="/assets/images/logo/bettergov-footer.svg"
                alt=""
                width={40}
                height={40}
                className="size-10"
                loading="lazy"
              />
              <span className="text-lg font-bold tracking-[-0.02em] text-white">BetterGov.PH</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-300">{t('footer-bettergov-text')}</p>
            <a
              href="https://bettergov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-blue-300"
            >
              {t('footer-bettergov-visit')}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-4 pt-5 text-xs text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>
              &copy; {currentYear} {t('footer-copyright-text')}
            </span>
            <span className="text-white/20" aria-hidden="true">
              ·
            </span>
            <a
              href={BUILDER.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-neutral-300 transition-colors hover:text-white"
            >
              {t('footer-built-by', { name: BUILDER.name })}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
            <span className="text-white/20" aria-hidden="true">
              ·
            </span>
            <span>MIT | CC BY 4.0</span>
            <span className="text-white/20" aria-hidden="true">
              ·
            </span>
            <AppLink to="/changelog" className="font-mono transition-colors hover:text-white">
              Ver. {siteVersion.version}
            </AppLink>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-300">
              {t('footer-cost')} <span className="font-mono font-semibold text-white">₱0</span>
            </span>
            {legal.map(([to, key]) => (
              <AppLink key={key} to={to} className="transition-colors hover:text-white">
                {t(key)}
              </AppLink>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
