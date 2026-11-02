// The BetterMati logo files offered on /about/logo (repo-root assets/images/logo/), and the
// colors they use. Byte sizes and PNG dimensions are checked against the files on disk by
// logoKit.test.ts, so a re-exported file fails the test until its entry is updated.

const DIR = '/assets/images/logo';

export interface LogoFile {
  href: string;
  format: 'SVG' | 'PNG';
  /** A full-bleed square for phone home screens rather than the round badge. */
  square?: boolean;
  bytes: number;
  width?: number;
  height?: number;
}

export interface LogoVersion {
  id: 'full' | 'white' | 'mark' | 'mark-white' | 'icon';
  /** The background the version is made for, used behind its preview. */
  background: 'light' | 'dark';
  previews: string[];
  files: LogoFile[];
}

export const LOGO_VERSIONS: LogoVersion[] = [
  {
    id: 'full',
    background: 'light',
    previews: [`${DIR}/better-mati-logo.svg`],
    files: [
      { href: `${DIR}/better-mati-logo.svg`, format: 'SVG', bytes: 17115 },
      {
        href: `${DIR}/better-mati-logo.png`,
        format: 'PNG',
        bytes: 30093,
        width: 868,
        height: 272,
      },
    ],
  },
  {
    id: 'white',
    background: 'dark',
    previews: [`${DIR}/better-mati-logo-white.svg`],
    files: [
      { href: `${DIR}/better-mati-logo-white.svg`, format: 'SVG', bytes: 17115 },
      {
        href: `${DIR}/better-mati-logo-white.png`,
        format: 'PNG',
        bytes: 26290,
        width: 919,
        height: 288,
      },
    ],
  },
  {
    id: 'mark',
    background: 'light',
    previews: [`${DIR}/better-mati-mark.svg`],
    files: [
      { href: `${DIR}/better-mati-mark.svg`, format: 'SVG', bytes: 551 },
      {
        href: `${DIR}/better-mati-mark.png`,
        format: 'PNG',
        bytes: 46483,
        width: 1100,
        height: 800,
      },
    ],
  },
  {
    id: 'mark-white',
    background: 'dark',
    previews: [`${DIR}/better-mati-mark-white.svg`],
    files: [
      { href: `${DIR}/better-mati-mark-white.svg`, format: 'SVG', bytes: 551 },
      {
        href: `${DIR}/better-mati-mark-white.png`,
        format: 'PNG',
        bytes: 43541,
        width: 1100,
        height: 800,
      },
    ],
  },
  {
    id: 'icon',
    background: 'light',
    previews: [`${DIR}/favicon.svg`, `${DIR}/icon-maskable-512.png`],
    files: [
      { href: `${DIR}/favicon.svg`, format: 'SVG', bytes: 857 },
      { href: `${DIR}/icon-512.png`, format: 'PNG', bytes: 31548, width: 512, height: 512 },
      {
        href: `${DIR}/icon-maskable-512.png`,
        format: 'PNG',
        square: true,
        bytes: 10990,
        width: 512,
        height: 512,
      },
    ],
  },
];

export interface LogoColor {
  id: 'navy' | 'royal' | 'amber' | 'sky' | 'wave';
  hex: string;
  /** The site's Tailwind token for the same color, where there is one. */
  token?: string;
}

// The values in the SVG files themselves; navy, royal and amber match index.css.
export const LOGO_COLORS: LogoColor[] = [
  { id: 'navy', hex: '#123C7A', token: '--color-navy' },
  { id: 'royal', hex: '#2B62EE', token: '--color-royal' },
  { id: 'amber', hex: '#FFC001', token: '--color-amber' },
  { id: 'sky', hex: '#E7EFFF' },
  { id: 'wave', hex: '#7EA3FF' },
];

/** "#2B62EE" -> "43 98 238". */
export function hexToRgb(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(' ');
}

/** 551 -> "551 B", 17115 -> "17 KB". */
export function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`;
}
