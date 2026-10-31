// Projects the barangay boundaries in data/mati/dist/mati_barangays.geojson into compact SVG
// path strings for the project map (web/src/lib/barangayPaths.json). Run after the boundary
// file is regenerated:  node web/scripts/build-barangay-paths.mjs
// The map is turned a quarter turn counter-clockwise so the long north-south city fits a wide
// section: north points left and the Pacific coast is at the top. The map shows a north arrow.
// A test (projectMap.test.ts) fails if the output no longer matches the boundary file.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const WIDTH = 1200;

export function buildBarangayPaths(geojson) {
  const rings = (g) => (g.type === 'Polygon' ? g.coordinates : g.coordinates.flat());
  const points = geojson.features.flatMap((f) => rings(f.geometry).flat());
  const lons = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)];
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  // Equirectangular: shrink longitude by cos(latitude) so the city keeps its shape.
  const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  // Rotated: x runs north → south, y runs east → west.
  const scale = WIDTH / (maxLat - minLat);
  const x = (lat) => Math.round((maxLat - lat) * scale * 10) / 10;
  const y = (lon) => Math.round((maxLon - lon) * k * scale * 10) / 10;
  const height = Math.ceil((maxLon - minLon) * k * scale);
  const shapes = geojson.features
    .map((f) => ({
      psgc: f.properties.psgc_code,
      name: f.properties.barangay,
      d: rings(f.geometry)
        .map((ring) => `M${ring.map(([lon, lat]) => `${x(lat)},${y(lon)}`).join('L')}Z`)
        .join(''),
    }))
    .sort((a, b) => a.psgc.localeCompare(b.psgc));
  return { viewBox: `0 0 ${WIDTH} ${height}`, shapes };
}

if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const SOURCE = `${root}data/mati/dist/mati_barangays.geojson`;
  const OUT = `${root}web/src/lib/barangayPaths.json`;
  const out = buildBarangayPaths(JSON.parse(readFileSync(SOURCE, 'utf8')));
  writeFileSync(OUT, `${JSON.stringify(out)}\n`);
  console.log(`${out.shapes.length} barangays → ${OUT} (${out.viewBox})`);
}
