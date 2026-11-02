// Every section and page of the site with a one-line description: drives the Site index
// page (/sitemap) and the page results of site-wide search (/search).
import { isMigratedRoute } from '@/lib/migratedRoutes';
import { attractions } from '@/lib/tourismData';

export interface IndexLink {
  to: string;
  /** i18n key for the label; `text` is rendered verbatim instead (data-driven names). */
  key?: string;
  text?: string;
  /** i18n key for the one-line description; `descText` is rendered verbatim instead. */
  desc?: string;
  descText?: string;
}

export interface IndexGroup {
  id: string;
  title: string;
  desc: string;
  links: IndexLink[];
}

export const PRIMARY: IndexLink[] = [
  { to: '/services', key: 'nav-services', desc: 'sitemap-dest-services-desc' },
  { to: '/government', key: 'nav-government', desc: 'sitemap-dest-government-desc' },
  { to: '/transparency', key: 'nav-transparency', desc: 'sitemap-dest-transparency-desc' },
  { to: '/statistics', key: 'nav-statistics', desc: 'sitemap-dest-statistics-desc' },
  { to: '/visit-mati', key: 'nav-visit-mati', desc: 'sitemap-dest-visit-desc' },
];

const SERVICE_CATEGORIES = [
  'certificates',
  'tax-payments',
  'business',
  'agriculture',
  'education',
  'health',
  'social-services',
  'public-safety',
  'infrastructure',
  'environment',
];

const SERVICE_GUIDES: [string, string][] = [
  ['/service-details/civil-registrar', 'sitemap-local-civil-registrar'],
  ['/service-details/municipal-treasurer', 'sitemap-treasurers-office'],
  ['/service-details/municipal-assessor', 'sitemap-assessors-office'],
  ['/service-details/municipal-budget', 'sitemap-budget-office'],
  ['/service-details/municipal-accounting', 'sitemap-accounting-office'],
  ['/service-details/municipal-engineering', 'sitemap-engineering-office'],
  ['/service-details/municipal-planning', 'sitemap-planning-office'],
  ['/service-details/municipal-agriculture', 'sitemap-agriculture-office'],
  ['/service-details/mswdo-services', 'sitemap-cswdo'],
  ['/service-details/business-permits-licensing', 'sitemap-bpls-office'],
  ['/service-details/general-services', 'sitemap-general-services'],
  ['/service-details/human-resource-management', 'sitemap-hr-management'],
  ['/service-details/seedo-public-market', 'sitemap-seedo-public-market'],
  ['/service-details/seedo-slaughterhouse', 'sitemap-seedo-slaughterhouse'],
  ['/service-details/tricycle-franchising', 'sitemap-tricycle-franchising'],
  ['/service-details/property-declaration', 'sitemap-property-declaration'],
];

export const GROUPS: IndexGroup[] = [
  {
    id: 'services',
    title: 'nav-services',
    desc: 'sitemap-group-services-desc',
    links: [
      { to: '/services', key: 'nav-services', desc: 'sitemap-dest-services-desc' },
      ...SERVICE_CATEGORIES.map((c) => ({
        to: `/services/${c}`,
        key: `dropdown-${c}`,
        desc: `nav-desc-${c}`,
      })),
    ],
  },
  {
    id: 'service-guides',
    title: 'sitemap-group-guides',
    desc: 'sitemap-group-guides-desc',
    links: SERVICE_GUIDES.map(([to, key]) => ({ to, key })),
  },
  {
    id: 'government',
    title: 'nav-government',
    desc: 'sitemap-group-government-desc',
    links: [
      { to: '/government', key: 'nav-government', desc: 'sitemap-dest-government-desc' },
      { to: '/government/officials', key: 'nav-officials', desc: 'nav-desc-officials' },
      { to: '/government/offices', key: 'gov-link-offices', desc: 'gov-link-offices-desc' },
      { to: '/government/barangays', key: 'gov-link-barangays', desc: 'gov-link-barangays-desc' },
      { to: '/government/links', key: 'links-title', desc: 'nav-desc-official-links' },
      { to: '/contact', key: 'gov-link-contact', desc: 'gov-link-contact-desc' },
      { to: '/contact#hotlines', key: 'gov-channels-hotlines', desc: 'sitemap-item-hotlines-desc' },
    ],
  },
  {
    id: 'legislation',
    title: 'nav-group-legislation',
    desc: 'sitemap-group-legislation-desc',
    links: [
      {
        to: '/legislative',
        key: 'nav-legislative-overview',
        desc: 'nav-desc-legislative-overview',
      },
      {
        to: '/legislative/ordinance-framework',
        key: 'dropdown-ordinance-framework',
        desc: 'nav-desc-ordinance-framework',
      },
      {
        to: '/legislative/resolution-framework',
        key: 'dropdown-resolution-framework',
        desc: 'nav-desc-resolution-framework',
      },
    ],
  },
  {
    id: 'transparency',
    title: 'sitemap-group-transparency',
    desc: 'sitemap-group-transparency-desc',
    links: [
      { to: '/transparency', key: 'nav-transparency', desc: 'sitemap-dest-transparency-desc' },
      { to: '/transparency/finance', key: 'finance-page-name', desc: 'transparency-find-finance' },
      {
        to: '/transparency/projects',
        key: 'projects-page-name',
        desc: 'transparency-find-projects',
      },
      { to: '/transparency/full-disclosure', key: 'fdp-page-name', desc: 'transparency-find-fdp' },
      { to: '/transparency/documents', key: 'docs-page-name', desc: 'transparency-find-docs' },
      { to: '/transparency/sources', key: 'sources-page-name', desc: 'nav-desc-sources' },
      {
        to: '/transparency/methodology',
        key: 'method-page-name',
        desc: 'transparency-find-method',
      },
      { to: '/statistics', key: 'nav-statistics', desc: 'gov-link-statistics-desc' },
      { to: '/news', key: 'nav-news', desc: 'nav-desc-news' },
    ],
  },
  {
    id: 'visit-mati',
    title: 'nav-visit-mati',
    desc: 'sitemap-group-visit-desc',
    links: [
      { to: '/visit-mati', key: 'nav-visit-mati', desc: 'sitemap-dest-visit-desc' },
      // Only attractions that have their own prerendered page.
      ...attractions
        .filter((a) => isMigratedRoute(`/visit-mati/${a.slug}`))
        .map((a) => ({ to: `/visit-mati/${a.slug}`, text: a.name, descText: a.tagline })),
    ],
  },
  {
    id: 'about-site',
    title: 'sitemap-group-about',
    desc: 'sitemap-group-about-desc',
    links: [
      { to: '/about', key: 'nav-about', desc: 'sitemap-item-about-desc' },
      { to: '/about/logo', key: 'logo-title', desc: 'sitemap-item-logo-desc' },
      { to: '/faq', key: 'footer-faq', desc: 'sitemap-item-faq-desc' },
      {
        to: '/accessibility',
        key: 'footer-accessibility',
        desc: 'sitemap-item-accessibility-desc',
      },
      { to: '/privacy', key: 'footer-privacy', desc: 'sitemap-item-privacy-desc' },
      { to: '/terms', key: 'footer-terms', desc: 'sitemap-item-terms-desc' },
      { to: '/changelog', key: 'changelog-title', desc: 'sitemap-item-changelog-desc' },
      { to: '/search', key: 'search-title', desc: 'search-lede' },
      { to: '/sitemap', key: 'footer-sitemap', desc: 'sitemap-lede' },
    ],
  },
];
