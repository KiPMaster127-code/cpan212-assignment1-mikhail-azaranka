// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.

import { config } from '../config.js';

const store = new Map();
let hits = 0;
let misses = 0;

const ttl = config.cacheTtlSeconds * 1000;

export function getCache(key) {
  const item = store.get(key);

  if (!item) {
    misses++;
    return undefined;
  }

  const expired = Date.now() > item.expiresAt;

  if (expired) {
    store.delete(key);
    misses++;
    return undefined;
  }

  hits++;
  return item.value;
}

export function setCache(key, value) {
  const expiresAt = Date.now() + ttl;
  store.set(key, { value, expiresAt });
}

export function getCacheStats() {
  let count = 0;

  for (const item of store.values()) {
    if (Date.now() < item.expiresAt) {
      count++;
    }
  }

  return {
    entries: count,
    hits,
    misses,
    ttlSeconds: config.cacheTtlSeconds
  };
}
