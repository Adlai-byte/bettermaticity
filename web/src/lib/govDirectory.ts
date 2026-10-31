import type { LucideIcon } from 'lucide-react';
import cityOfficesJson from '@data/city-offices.json';
import { hotlineById, primaryNumber } from '@/lib/hotlines';
import {
  FileText,
  Coins,
  Ruler,
  Users,
  Sprout,
  ClipboardList,
  House,
  Calculator,
  PiggyBank,
  Package,
  HeartPulse,
  Store,
  IdCard,
  TriangleAlert,
  Briefcase,
} from 'lucide-react';

// City offices that have a service guide on this site. Names follow the City's own
// Departments and Offices list (data/city-offices.json); descriptions are ours. The
// phone numbers and emails below are template values: only verifiedPhone ones are shown.

export interface GovDepartment {
  Icon: LucideIcon;
  /** i18n key for the office name; falls back to `title` literal when absent. */
  titleKey?: string;
  title?: string;
  descKey: string;
  /** Display phone, e.g. "(087) 326-5011". */
  phone: string;
  /** tel: digits. */
  tel: string;
  /** True only when the number comes from a sourced dataset (e.g. the hotline feed).
   *  Unverified template numbers stay in the data but are not shown. */
  verifiedPhone?: boolean;
  /** i18n key whose value is the office email address. */
  emailKey?: string;
  to: string;
  /** Optional external link (PESO job vacancies). */
  jobUrl?: string;
}

// Disaster-response contact comes from the verified emergency-hotline dataset, not
// from a literal here — see data/emergency-hotlines.json.
const cdrrmo = primaryNumber(hotlineById('cdrrmo'));

export const departments: GovDepartment[] = [
  {
    Icon: FileText,
    titleKey: 'gov-municipal-civil-registrar',
    descKey: 'gov-birth-death-marriage-certificates-cenomar',
    phone: '(087) 326-5011',
    tel: '0873265011',
    emailKey: 'gov-civilregmatigovph',
    to: '/service-details/municipal-civil-registrar',
  },
  {
    Icon: Coins,
    titleKey: 'gov-municipal-treasurers-office',
    descKey: 'gov-tax-payments-real-property-tax-revenue-collection',
    phone: '(087) 326-5012',
    tel: '0873265012',
    emailKey: 'gov-treasurermatigovph',
    to: '/service-details/municipal-treasurer',
  },
  {
    Icon: Ruler,
    titleKey: 'gov-municipal-engineering-office',
    descKey: 'gov-building-permits-construction-permits',
    phone: '(087) 326-5013',
    tel: '0873265013',
    emailKey: 'gov-engineermatigovph',
    to: '/service-details/municipal-engineering',
  },
  {
    Icon: Users,
    title: 'City Social Welfare and Development Office (CSWDO)',
    descKey: 'gov-social-services-pwd-senior-citizen-ids-financial',
    phone: '(087) 326-5014',
    tel: '0873265014',
    emailKey: 'gov-mswdomatigovph',
    to: '/service-details/mswdo-services',
  },
  {
    Icon: Sprout,
    titleKey: 'gov-municipal-agriculture-office',
    descKey: 'gov-agricultural-loans-crop-insurance-fertilizer',
    phone: '(087) 326-5015',
    tel: '0873265015',
    emailKey: 'gov-agrimatigovph',
    to: '/service-details/municipal-agriculture',
  },
  {
    Icon: ClipboardList,
    titleKey: 'gov-municipal-planning-development',
    descKey: 'gov-development-planning-project-monitoring-zoning',
    phone: '(087) 326-5016',
    tel: '0873265016',
    emailKey: 'gov-mpdomatigovph',
    to: '/service-details/municipal-planning',
  },
  {
    Icon: House,
    titleKey: 'gov-municipal-assessors-office',
    descKey: 'gov-property-assessment-tax-declarations-land-records',
    phone: '(087) 326-5017',
    tel: '0873265017',
    emailKey: 'gov-assessormatigovph',
    to: '/service-details/municipal-assessor',
  },
  {
    Icon: Calculator,
    titleKey: 'gov-municipal-accounting-office',
    descKey: 'gov-financial-records-disbursements-accounting',
    phone: '(087) 326-5001',
    tel: '0873265001',
    emailKey: 'gov-accountingmatigovph',
    to: '/service-details/municipal-accounting',
  },
  {
    Icon: PiggyBank,
    titleKey: 'gov-municipal-budget-office',
    descKey: 'gov-budget-preparation-appropriations-fiscal',
    phone: '(087) 326-5001',
    tel: '0873265001',
    emailKey: 'gov-budgetmatigovph',
    to: '/service-details/municipal-budget',
  },
  {
    Icon: Package,
    titleKey: 'gov-municipal-general-services-office',
    descKey: 'gov-property-management-procurement-administration',
    phone: '(087) 326-5001',
    tel: '0873265001',
    emailKey: 'gov-gsomatigovph',
    to: '/service-details/municipal-general-services',
  },
  {
    Icon: HeartPulse,
    titleKey: 'gov-municipal-health-office',
    descKey: 'gov-vaccination-health-certificates-medical-assistance',
    phone: '(087) 326-5010',
    tel: '0873265010',
    emailKey: 'gov-mhomatigovph',
    to: '/services/health',
  },
  {
    Icon: Store,
    titleKey: 'gov-business-permits-licensing',
    descKey: 'gov-business-permits-mayors-clearance-licensing',
    phone: '(087) 326-5002',
    tel: '0873265002',
    emailKey: 'gov-bplsmatigovph',
    to: '/service-details/business-permits-licensing',
  },
  {
    Icon: IdCard,
    titleKey: 'gov-human-resource-management',
    descKey: 'gov-personnel-services-recruitment-employee-records',
    phone: '(087) 326-5002',
    tel: '0873265002',
    emailKey: 'gov-hrmomatigovph',
    to: '/service-details/human-resource-management',
  },
  {
    Icon: TriangleAlert,
    title: 'City Disaster Risk Reduction and Management Office (CDRRMO)',
    descKey: 'gov-disaster-preparedness-emergency-response-risk',
    phone: cdrrmo.display,
    tel: cdrrmo.tel,
    verifiedPhone: true,
    emailKey: 'gov-mdrrmomatigovph',
    to: '/services/public-safety',
  },
  {
    Icon: Store,
    titleKey: 'gov-seedo-public-market',
    descKey: 'gov-market-clearance-entrance-fees-vendor-services-ctc',
    phone: '(087) 326-5001',
    tel: '0873265001',
    to: '/service-details/seedo-public-market',
  },
  {
    Icon: Package,
    titleKey: 'gov-seedo-slaughterhouse',
    descKey: 'gov-hog-cattle-goat-carabao-slaughter-with-meat',
    phone: '(087) 326-5001',
    tel: '0873265001',
    to: '/service-details/seedo-slaughterhouse',
  },
  {
    Icon: Briefcase,
    title: 'Public Employment Service Office (PESO-Mati)',
    descKey: 'gov-job-placement-employment-assistance-career',
    phone: '0917-155-1043',
    tel: '09171551043',
    to: '/services/public-safety',
    jobUrl: 'https://www.facebook.com/profile.php?id=61564916854423',
  },
];

// The City's own list of its departments and offices, grouped as the City groups them.
// Names only: the City publishes no heads or contacts for them.
export interface CityOfficeGroup {
  name: string;
  offices: { name: string; printedAs?: string }[];
}

export const cityOfficeGroups: CityOfficeGroup[] = cityOfficesJson.groups;
export const cityOfficesSource = cityOfficesJson.source;
export const cityOfficesCheckedOn = cityOfficesJson.checkedOn;
export const cityOfficeCount = cityOfficeGroups.reduce((n, g) => n + g.offices.length, 0);
