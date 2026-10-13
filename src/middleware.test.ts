import { describe, expect, it } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './proxy';
import { version as maplibreVersion } from 'maplibre-gl/package.json';

const vendorDir = fileURLToPath(new URL('../public/vendor/maplibre/', import.meta.url));
const workerPath = `/vendor/maplibre/${maplibreVersion}/maplibre-gl-worker.mjs`;

describe('map runtime assets', () => {
  const matches = (path: string) => config.matcher.some(m => new RegExp(`^${m}$`).test(path));

  it('ships the worker the bundle actually asks for', () => {
    expect(existsSync(`${vendorDir}${maplibreVersion}/maplibre-gl-worker.mjs`)).toBe(true);
    expect(existsSync(`${vendorDir}${maplibreVersion}/maplibre-gl-shared.mjs`)).toBe(true);
  });

  it('keeps exactly one vendored version', () => {
    expect(readdirSync(vendorDir, { withFileTypes: true })
      .filter(e => e.isDirectory()).map(e => e.name)).toEqual([maplibreVersion]);
  });

  it('excludes the map worker, its sibling, and the basemap style from proxy matching', () => {
    expect(matches(workerPath)).toBe(false);
    expect(matches(`/vendor/maplibre/${maplibreVersion}/maplibre-gl-shared.mjs`)).toBe(false);
    expect(matches('/dark-matter-style.json')).toBe(false);
  });

  it('matches pages but excludes API routes', () => {
    expect(matches('/')).toBe(true);
    expect(matches('/merch')).toBe(true);
    expect(matches('/api/cctv')).toBe(false);
  });
});
