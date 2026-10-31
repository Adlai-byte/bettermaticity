import { describe, expect, it } from 'vitest';
import { officialInitials } from './utils';

describe('officialInitials', () => {
  it('uses the first and last name, skipping the honorific', () => {
    expect(officialInitials('Hon. Joel Mayo Z. Almario')).toBe('JA');
  });

  it('skips name suffixes such as Jr.', () => {
    expect(officialInitials('Hon. Edmundo Z. Pang Jr.')).toBe('EP');
    expect(officialInitials('Hon. Francisco G. Bardon Jr.')).toBe('FB');
  });

  it('falls back to a dash for an empty name', () => {
    expect(officialInitials('Hon. ')).toBe('—');
  });
});
