import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

// <Seo> renders vite-react-ssg's <Head>, which needs a HelmetProvider we don't
// mount in unit tests; stub it out since the page's <head> isn't under test here.
vi.mock('@/components/Seo', () => ({ Seo: () => null }));

import VisitMati from './VisitMati';
import migratedRoutes from '../../migrated-routes.json';
import {
  attractions,
  featuredAttractions,
  filters,
  seasons,
  festivals,
  planYourTrip,
  gallery,
  getAttraction,
  getPhoto,
  photos,
} from '@/lib/tourismData';
import DahicanBeach from './visit-mati/DahicanBeach';

const routes = new Set(migratedRoutes as string[]);

function renderPage() {
  return render(
    <MemoryRouter>
      <VisitMati />
    </MemoryRouter>
  );
}

describe('Visit Mati hub page', () => {
  it('renders the hero and every section heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/two coasts/i);
    expect(
      screen.getByRole('heading', { name: /The open Pacific, and the sheltered bay/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Where to go in Mati/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /A year on the water/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sambuokan Festival/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Getting here, getting around/i })
    ).toBeInTheDocument();
  });

  it('lists every attraction in the directory by default', () => {
    renderPage();
    for (const a of attractions) {
      expect(screen.getByRole('heading', { name: a.name })).toBeInTheDocument();
    }
  });

  it('links each featured attraction to its detail route', () => {
    renderPage();
    // The directory only: photo credits further down also mention places by name.
    const places = within(document.getElementById('places')!);
    for (const a of featuredAttractions) {
      const link = places.getByRole('link', { name: new RegExp(a.name) });
      expect(link).toHaveAttribute('href', `/visit-mati/${a.slug}`);
    }
  });

  it('filters the directory when a category chip is pressed', () => {
    renderPage();
    const culture = attractions.filter((a) => a.filter === 'Culture');
    const other = attractions.find((a) => a.filter !== 'Culture')!;
    fireEvent.click(screen.getByRole('button', { name: /^Culture/ }));
    for (const a of culture) {
      expect(screen.getByRole('heading', { name: a.name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { name: other.name })).not.toBeInTheDocument();
  });

  it('shows a season row for every guide entry', () => {
    renderPage();
    for (const row of seasons) {
      expect(screen.getAllByText(row.label).length).toBeGreaterThan(0);
    }
  });

  it('credits every photo with its source, and each card names its photo’s publisher', () => {
    renderPage();
    const section = screen
      .getByRole('heading', { name: /Where these photos come from/i })
      .closest('section')!;
    for (const p of photos) {
      for (const s of p.sources) {
        // Two photos can come from the same article, so a source may be listed twice.
        const links = within(section).getAllByRole('link', { name: s.title });
        expect(links.every((l) => l.getAttribute('href') === s.url)).toBe(true);
      }
    }
    const places = within(document.getElementById('places')!);
    const dahican = places.getByRole('link', { name: /Dahican Beach/ });
    expect(dahican).toHaveTextContent('Photo: City Government of Mati');
  });

  it('renders the travel-responsibly guidance', () => {
    renderPage();
    const heading = screen.getByRole('heading', { name: /Travel responsibly/i });
    const card = heading.closest('div')!;
    expect(within(card).getAllByRole('listitem').length).toBeGreaterThan(0);
  });
});

describe('attraction detail page', () => {
  it('shows the attraction’s photo with its credit and a link to the source', () => {
    const { container } = render(
      <MemoryRouter>
        <DahicanBeach />
      </MemoryRouter>
    );
    const photo = getPhoto(getAttraction('dahican-beach')!.photo)!;
    expect(container.querySelector(`img[src="${photo.src}"]`)).toHaveAttribute('alt', photo.alt);
    expect(screen.getByText('Photo: City Government of Mati')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Source/ })).toHaveAttribute(
      'href',
      photo.sources[0].url
    );
  });
});

describe('tourism feed integrity', () => {
  it('every filter chip label is valid', () => {
    expect(filters[0]).toBe('All');
    for (const f of filters.slice(1)) {
      expect(attractions.some((a) => a.filter === f)).toBe(true);
    }
  });

  it('every featured attraction has a prerendered detail route', () => {
    for (const a of featuredAttractions) {
      expect(routes.has(`/visit-mati/${a.slug}`)).toBe(true);
      expect(getAttraction(a.slug)).toBe(a);
    }
  });

  it('the hub route itself is prerendered', () => {
    expect(routes.has('/visit-mati')).toBe(true);
  });

  it('every attraction has the fields the directory card needs', () => {
    for (const a of attractions) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(a.name).toBeTruthy();
      expect(a.blurb).toBeTruthy();
      expect(a.filter).toBeTruthy();
      expect(a.where).toBeTruthy();
      expect(a.note).toBeTruthy();
      expect(a.imageLabel).toBeTruthy();
    }
  });

  it('every featured attraction has the fields the detail page needs', () => {
    for (const a of featuredAttractions) {
      expect(a.tagline).toBeTruthy();
      expect(a.highlights.length).toBeGreaterThan(0);
      expect(a.sections.length).toBeGreaterThan(0);
      for (const s of a.sections) {
        expect(s.heading).toBeTruthy();
        expect(s.body).toBeTruthy();
      }
    }
  });

  it('every season row has twelve month cells', () => {
    for (const row of seasons) {
      expect(row.cells.length).toBe(12);
    }
  });

  it('exposes non-empty festivals, trip info, and gallery', () => {
    expect(festivals.length).toBeGreaterThan(0);
    expect(planYourTrip.whereToStay.length).toBeGreaterThan(0);
    expect(planYourTrip.localFood.length).toBeGreaterThan(0);
    expect(gallery.length).toBeGreaterThan(0);
  });
});
