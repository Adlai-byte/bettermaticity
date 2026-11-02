import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Home, the layout and the 404 load with the app; every other page is its own chunk,
// fetched on navigation (vite-react-ssg resolves it before prerender and hydration).
export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: 'services',
        lazy: () => import('./pages/Services').then((m) => ({ Component: m.default })),
      },
      {
        path: 'services/health',
        lazy: () => import('./pages/ServicesHealth').then((m) => ({ Component: m.default })),
      },
      {
        path: 'services/certificates',
        lazy: () =>
          import('./pages/categories').then((m) => ({ Component: m.ServicesCertificates })),
      },
      {
        path: 'services/social-services',
        lazy: () => import('./pages/categories').then((m) => ({ Component: m.ServicesSocial })),
      },
      {
        path: 'services/agriculture',
        lazy: () =>
          import('./pages/categories').then((m) => ({ Component: m.ServicesAgriculture })),
      },
      {
        path: 'services/infrastructure',
        lazy: () =>
          import('./pages/categories').then((m) => ({ Component: m.ServicesInfrastructure })),
      },
      {
        path: 'services/public-safety',
        lazy: () =>
          import('./pages/categories').then((m) => ({ Component: m.ServicesPublicSafety })),
      },
      {
        path: 'services/environment',
        lazy: () =>
          import('./pages/categories').then((m) => ({ Component: m.ServicesEnvironment })),
      },
      {
        path: 'services/business',
        lazy: () => import('./pages/categories2').then((m) => ({ Component: m.ServicesBusiness })),
      },
      {
        path: 'services/tax-payments',
        lazy: () =>
          import('./pages/categories2').then((m) => ({ Component: m.ServicesTaxPayments })),
      },
      {
        path: 'services/education',
        lazy: () => import('./pages/categories2').then((m) => ({ Component: m.ServicesEducation })),
      },
      {
        path: 'privacy',
        lazy: () => import('./pages/Privacy').then((m) => ({ Component: m.default })),
      },
      {
        path: 'terms',
        lazy: () => import('./pages/Terms').then((m) => ({ Component: m.default })),
      },
      {
        path: 'accessibility',
        lazy: () => import('./pages/Accessibility').then((m) => ({ Component: m.default })),
      },
      { path: 'faq', lazy: () => import('./pages/Faq').then((m) => ({ Component: m.default })) },
      {
        path: 'sitemap',
        lazy: () => import('./pages/SitemapPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'search',
        lazy: () => import('./pages/Search').then((m) => ({ Component: m.default })),
      },
      {
        path: 'changelog',
        lazy: () => import('./pages/Changelog').then((m) => ({ Component: m.default })),
      },
      {
        path: 'contact',
        lazy: () => import('./pages/Contact').then((m) => ({ Component: m.default })),
      },
      {
        path: 'about',
        lazy: () => import('./pages/About').then((m) => ({ Component: m.default })),
      },
      {
        path: 'about/logo',
        lazy: () => import('./pages/AboutLogo').then((m) => ({ Component: m.default })),
      },
      {
        path: 'government',
        lazy: () => import('./pages/Government').then((m) => ({ Component: m.default })),
      },
      {
        path: 'government/officials',
        lazy: () => import('./pages/GovernmentOfficials').then((m) => ({ Component: m.default })),
      },
      {
        path: 'government/offices',
        lazy: () => import('./pages/GovernmentOffices').then((m) => ({ Component: m.default })),
      },
      {
        path: 'government/barangays',
        lazy: () => import('./pages/GovernmentBarangays').then((m) => ({ Component: m.default })),
      },
      {
        path: 'government/links',
        lazy: () => import('./pages/GovernmentLinks').then((m) => ({ Component: m.default })),
      },
      {
        path: 'legislative',
        lazy: () => import('./pages/Legislative').then((m) => ({ Component: m.default })),
      },
      {
        path: 'legislative/ordinance-framework',
        lazy: () => import('./pages/OrdinanceFramework').then((m) => ({ Component: m.default })),
      },
      {
        path: 'legislative/resolution-framework',
        lazy: () => import('./pages/ResolutionFramework').then((m) => ({ Component: m.default })),
      },
      { path: 'news', lazy: () => import('./pages/News').then((m) => ({ Component: m.default })) },
      {
        path: 'transparency',
        lazy: () =>
          import('./pages/transparency/TransparencyHub').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/finance',
        lazy: () => import('./pages/transparency/Finance').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/projects',
        lazy: () => import('./pages/transparency/Projects').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/full-disclosure',
        lazy: () =>
          import('./pages/transparency/FullDisclosure').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/documents',
        lazy: () =>
          import('./pages/transparency/Documents').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/sources',
        lazy: () => import('./pages/Sources').then((m) => ({ Component: m.default })),
      },
      {
        path: 'transparency/methodology',
        lazy: () =>
          import('./pages/transparency/Methodology').then((m) => ({ Component: m.default })),
      },
      {
        path: 'statistics',
        lazy: () => import('./pages/Statistics').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati',
        lazy: () => import('./pages/VisitMati').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati/dahican-beach',
        lazy: () =>
          import('./pages/visit-mati/DahicanBeach').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati/mount-hamiguitan',
        lazy: () =>
          import('./pages/visit-mati/MountHamiguitan').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati/pujada-bay',
        lazy: () => import('./pages/visit-mati/PujadaBay').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati/sleeping-dinosaur',
        lazy: () =>
          import('./pages/visit-mati/SleepingDinosaur').then((m) => ({ Component: m.default })),
      },
      {
        path: 'visit-mati/subangan-museum',
        lazy: () =>
          import('./pages/visit-mati/SubanganMuseum').then((m) => ({ Component: m.default })),
      },
      {
        path: 'service-details/birth-certificate',
        lazy: () =>
          import('./pages/service-details/BirthCertificate').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/death-certificate',
        lazy: () =>
          import('./pages/service-details/DeathCertificate').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/marriage-certificate',
        lazy: () =>
          import('./pages/service-details/MarriageCertificate').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/municipal-treasurer',
        lazy: () =>
          import('./pages/service-details/MunicipalTreasurer').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/tricycle-franchising',
        lazy: () =>
          import('./pages/service-details/TricycleFranchising').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/property-declaration',
        lazy: () =>
          import('./pages/service-details/PropertyDeclaration').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/municipal-planning',
        lazy: () =>
          import('./pages/service-details/MunicipalPlanning').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/municipal-engineering',
        lazy: () =>
          import('./pages/service-details/MunicipalEngineering').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/general-services',
        lazy: () =>
          import('./pages/service-details/GeneralServices').then((m) => ({ Component: m.default })),
      },
      {
        path: 'service-details/municipal-agriculture',
        lazy: () =>
          import('./pages/service-details/MunicipalAgriculture').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/business-permits-licensing',
        lazy: () =>
          import('./pages/service-details/BusinessPermitsLicensing').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/civil-registrar',
        lazy: () =>
          import('./pages/service-details/CivilRegistrar').then((m) => ({ Component: m.default })),
      },
      {
        path: 'service-details/municipal-accounting',
        lazy: () =>
          import('./pages/service-details/MunicipalAccounting').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/municipal-general-services',
        lazy: () =>
          import('./pages/service-details/MunicipalGeneralServices').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/seedo-public-market',
        lazy: () =>
          import('./pages/service-details/SeedoPublicMarket').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/human-resource-management',
        lazy: () =>
          import('./pages/service-details/HumanResourceManagement').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/mswdo-services',
        lazy: () =>
          import('./pages/service-details/MswdoServices').then((m) => ({ Component: m.default })),
      },
      {
        path: 'service-details/municipal-budget',
        lazy: () =>
          import('./pages/service-details/MunicipalBudget').then((m) => ({ Component: m.default })),
      },
      {
        path: 'service-details/municipal-civil-registrar',
        lazy: () =>
          import('./pages/service-details/MunicipalCivilRegistrar').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/seedo-slaughterhouse',
        lazy: () =>
          import('./pages/service-details/SeedoSlaughterhouse').then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: 'service-details/municipal-assessor',
        lazy: () =>
          import('./pages/service-details/MunicipalAssessor').then((m) => ({
            Component: m.default,
          })),
      },
      // Not prerendered (absent from migrated-routes.json); Apache serves 404.html for
      // direct hits, this covers client-side navigation and preview hosts.
      { path: '*', Component: NotFound },
    ],
  },
];
