/** Absolute URL of a page's public view; this is what QR codes encode. */
export function publicPageUrl(uuid: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({ uuid, ...params })
  return `${window.location.origin}/page?${query}`
}
