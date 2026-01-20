export function safeTruncate(s: string, max = 240): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}