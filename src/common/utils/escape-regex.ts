export function escapeRegex(value: string, maxLength = 80) {
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
