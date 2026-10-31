export { cn } from 'cn';

/** Initials for an avatar, e.g. 'Hon. Joel Mayo Z. Almario' -> 'JA', 'Hon. Edmundo Z. Pang Jr.' -> 'EP'. */
export function officialInitials(name: string): string {
  const parts = name
    .replace(/^Hon\.\s*/i, '')
    .replace(/["'.]/g, '')
    .split(/\s+/)
    .filter((p) => p && !/^(jr|sr|ii|iii|iv)$/i.test(p));
  if (parts.length === 0) return '—';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase() || '—';
}
