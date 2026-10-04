import type { LocationQueryValue } from 'vue-router'

/** Only follow in-app paths, so ?redirect= can't send users to another site. */
export function safeRedirect(value: LocationQueryValue | LocationQueryValue[] | undefined) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}
