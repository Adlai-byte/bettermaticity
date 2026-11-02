import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOGO_COLORS, LOGO_VERSIONS, formatBytes, hexToRgb } from './logoKit';

// Repo root; the logo files are served from assets/ as a static passthrough.
const ROOT = join(__dirname, '../../..');
const onDisk = (href: string) => join(ROOT, href);

/** Width and height from a PNG's IHDR chunk. */
function pngSize(path: string) {
  const b = readFileSync(path);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

describe('logo kit', () => {
  const files = LOGO_VERSIONS.flatMap((v) => v.files);

  it('offers files that exist, at the size and dimensions it states', () => {
    for (const f of files) {
      expect(existsSync(onDisk(f.href)), f.href).toBe(true);
      expect(statSync(onDisk(f.href)).size, f.href).toBe(f.bytes);
      if (f.format === 'PNG') {
        expect(pngSize(onDisk(f.href)), f.href).toEqual({ width: f.width, height: f.height });
      }
    }
    for (const src of LOGO_VERSIONS.flatMap((v) => v.previews))
      expect(existsSync(onDisk(src)), src).toBe(true);
  });

  it('lists the colors the logo files actually use, matching the site tokens', () => {
    const svgs = files
      .filter((f) => f.format === 'SVG')
      .map((f) => readFileSync(onDisk(f.href), 'utf8').toUpperCase())
      .join('\n');
    for (const c of LOGO_COLORS) expect(svgs, c.id).toContain(c.hex);

    const css = readFileSync(join(ROOT, 'web/src/index.css'), 'utf8');
    for (const c of LOGO_COLORS.filter((c) => c.token))
      expect(css.toUpperCase(), c.id).toContain(`${c.token!.toUpperCase()}: ${c.hex}`);
  });

  it('formats colors and sizes for display', () => {
    expect(hexToRgb('#2B62EE')).toBe('43 98 238');
    expect(formatBytes(551)).toBe('551 B');
    expect(formatBytes(17115)).toBe('17 KB');
  });
});
