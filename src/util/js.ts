export function isClass(v) {
  return typeof v === 'function' && /^class .*/.test(v.toString());
}

export function isFunctionNotClass(v) {
  return typeof v === 'function' && ! /^class .*/.test(v.toString());
}