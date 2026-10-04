/** True for solid hex backgrounds dark enough to need light text on top. */
export function isDarkColor(value: string | undefined) {
  const hex = value?.match(/^#([0-9a-f]{6})$/i)?.[1]
  if (!hex) return false
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 < 128
}
