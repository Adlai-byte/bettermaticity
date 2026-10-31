// Site-wide search index for /search: every page from the Site index plus the records the
// site publishes (services, offices, officials, legislation, projects, procurement,
// documents and official links). Built per language, since most titles are i18n keys.
import Fuse from 'fuse.js';
import { GROUPS, PRIMARY, type IndexLink } from '@/lib/siteIndex';
import { services } from '@/lib/services';
import { cityOfficeGroups, departments } from '@/lib/govDirectory';
import { officials, officialsAreDraft, ordinances, resolutions } from '@/lib/govData';
import { risingProjects, projectAnchor } from '@/lib/risingProjects';
import { noticeSearchText, procurementNotices } from '@/lib/infrastructureData';
import { fdpRecords, officialDocuments } from '@/lib/transparencyData';
import { officialLinks } from '@/lib/officialLinks';
import awardedWorks from '@data/awarded-civil-works.json';

export type ResultType =
  | 'page'
  | 'service'
  | 'office'
  | 'official'
  | 'legislation'
  | 'project'
  | 'notice'
  | 'document'
  | 'link';

/** Display order of result groups. */
export const RESULT_TYPES: ResultType[] = [
  'page',
  'service',
  'office',
  'official',
  'legislation',
  'project',
  'notice',
  'document',
  'link',
];

export interface SearchRecord {
  id: string;
  type: ResultType;
  title: string;
  desc: string;
  /** Internal path (with optional #anchor) or an absolute external URL. */
  to: string;
  keywords?: string;
}

type Translate = (key: string, opts?: Record<string, unknown>) => string;

function pageRecords(t: Translate): SearchRecord[] {
  const seen = new Set<string>();
  const out: SearchRecord[] = [];
  const add = (l: IndexLink) => {
    if (seen.has(l.to) || l.to.startsWith('http')) return;
    seen.add(l.to);
    out.push({
      id: `page:${l.to}`,
      type: 'page',
      title: l.text ?? t(l.key!),
      desc: l.descText ?? (l.desc ? t(l.desc) : ''),
      to: l.to,
    });
  };
  PRIMARY.forEach(add);
  for (const g of GROUPS) g.links.forEach(add);
  return out;
}

export function buildSearchIndex(t: Translate): SearchRecord[] {
  const legislation = [
    ...ordinances.map((o) => ({
      no: `${t('search-ordinance')} ${o.ordinanceNo}`,
      r: o,
      to: '/legislative/ordinance-framework',
    })),
    ...resolutions.map((r) => ({
      no: `${t('search-resolution')} ${r.resolutionNo}`,
      r,
      to: '/legislative/resolution-framework',
    })),
  ];
  const guideOffices = new Set(departments.map((d) => (d.titleKey ? t(d.titleKey) : d.title)));
  const otherOffices = cityOfficeGroups.flatMap((g) =>
    g.offices.filter((o) => !guideOffices.has(o.name)).map((o) => ({ ...o, group: g.name }))
  );
  const people = officialsAreDraft
    ? []
    : [officials.mayor, officials.vice_mayor, ...(officials.councilors ?? [])].filter(
        (o) => o !== undefined
      );

  return [
    ...pageRecords(t),
    ...services.map((s) => ({
      id: `service:${s.id}`,
      type: 'service' as const,
      title: s.title,
      desc: [s.category, s.office].filter(Boolean).join(' · '),
      to: s.path,
      keywords: [...s.keywords, s.description].join(' '),
    })),
    ...departments.map((d) => ({
      id: `office:${d.titleKey ?? d.title}`,
      type: 'office' as const,
      title: d.titleKey ? t(d.titleKey) : (d.title ?? ''),
      desc: t(d.descKey),
      to: d.to,
    })),
    ...otherOffices.map((o) => ({
      id: `office:${o.name}`,
      type: 'office' as const,
      title: o.name,
      desc: o.group,
      to: '/government/offices#all-offices',
    })),
    ...people.map((o) => ({
      id: `official:${o.name}`,
      type: 'official' as const,
      title: o.name,
      desc: o.title,
      to: '/government/officials',
    })),
    ...legislation.map(({ no, r, to }) => ({
      id: `legislation:${no}`,
      type: 'legislation' as const,
      title: r.officialTitle ?? no,
      desc: `${no} · ${t(r.summaryKey)}`,
      to,
    })),
    ...risingProjects.map((p) => ({
      id: `project:${p.id}`,
      type: 'project' as const,
      title: t(p.titleKey),
      desc: t(`rising-scope-${p.scope}`),
      to: `/transparency/projects#${projectAnchor(p)}`,
      keywords: t(p.detailKey),
    })),
    ...awardedWorks.works.map((w) => ({
      id: `awarded:${w.id}`,
      type: 'project' as const,
      title: w.name,
      desc: `${w.location} · ${w.period}`,
      to: '/transparency/projects#awarded-works',
      keywords: w.winningBidder,
    })),
    ...procurementNotices.map((n) => ({
      id: `notice:${n.reference}`,
      type: 'notice' as const,
      title: n.name,
      desc: `${n.classification} · ${n.id}`,
      to: '/transparency/projects#procurement',
      keywords: noticeSearchText(n),
    })),
    ...officialDocuments.map((d) => ({
      id: `document:${d.id}`,
      type: 'document' as const,
      title: d.title,
      desc: d.issuer,
      to: `/transparency/documents#${d.id}`,
    })),
    // Archived files one by one; portal postings once per report type, so a search
    // for "budget" doesn't return every quarterly filing.
    ...fdpRecords
      .filter((r) => r.source === 'archive')
      .map((r) => ({
        id: `fdp:${r.url}`,
        type: 'document' as const,
        title: r.title,
        desc: `${r.type} · ${r.period}`,
        to: '/transparency/full-disclosure#archive',
      })),
    ...[
      ...new Set(fdpRecords.filter((r) => r.source === 'dilg-fdp-portal').map((r) => r.type)),
    ].map((type) => ({
      id: `fdp-type:${type}`,
      type: 'document' as const,
      title: type,
      desc: t('search-fdp-desc'),
      to: '/transparency/full-disclosure#archive',
    })),
    ...officialLinks.map((l) => ({
      id: `link:${l.id}`,
      type: 'link' as const,
      title: l.name,
      desc: l.owner,
      to: l.url,
      keywords: l.purpose,
    })),
  ];
}

export function createSearcher(records: SearchRecord[]) {
  const fuse = new Fuse(records, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'keywords', weight: 1.5 },
      { name: 'desc', weight: 1 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
  });
  return (query: string) => fuse.search(query.trim()).map((r) => r.item);
}
