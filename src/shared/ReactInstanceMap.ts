export function set( key, value ) {
  key._reactInternalFiber = value
}

export function get( key ) {
  return key._reactInternalFiber
}