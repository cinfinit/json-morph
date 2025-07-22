// src/utils.js

export function get(obj, path) {
  return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}

export function set(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let curr = obj;
  for (const key of keys) {
    if (!curr[key]) curr[key] = {};
    curr = curr[key];
  }
  curr[lastKey] = value;
}

export function removeKey(obj, path) {
  const keys = path.split('.');
  const last = keys.pop();
  let curr = obj;
  for (const key of keys) {
    if (!curr[key]) return;
    curr = curr[key];
  }
  delete curr[last];
}
