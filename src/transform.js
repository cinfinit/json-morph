// src/transform.js

import { buildFilter } from './filters.js';
import { get, set, removeKey } from './utils.js';

export function transformJson(data, flags) {
  let result = Array.isArray(data) ? [...data] : [data];

  // 1. Apply filters (all combined with &&)
  if (flags.filter.length > 0) {
    const combinedFilter = buildFilter(flags.filter.join(' && '));
    result = result.filter(combinedFilter);
  }

  // 2. Apply field mapping
  if (flags.map.length > 0) {
    result = result.map(item => {
  const base = flags.preserve ? { ...item } : {};
  for (const map of flags.map) {
    const [from, to] = map.split(':');
    const value = get(item, from);
    set(base, to, value);
  }
  return base;
    // result = result.map(item => {
    //   const clone = {};
    //   for (const map of flags.map) {
    //     const [from, to] = map.split(':');
    //     const value = get(item, from);
    //     set(clone, to, value);
    //   }
    //   return clone;
    });
  }

  // 3. Add static fields
  if (flags.add.length > 0) {
    result = result.map(item => {
      const copy = { ...item };
      for (const entry of flags.add) {
        const [key, rawValue] = entry.split(':');
        const value = parseValue(rawValue);
        set(copy, key, value);
      }
      return copy;
    });
  }

  // 4. Remove keys
  if (flags.remove.length > 0) {
    result = result.map(item => {
      const copy = { ...item };
      for (const key of flags.remove) {
        removeKey(copy, key);
      }
      return copy;
    });
  }

  return Array.isArray(data) ? result : result[0];
}

function parseValue(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null') return null;
  if (!isNaN(Number(val))) return Number(val);
  return val;
}
