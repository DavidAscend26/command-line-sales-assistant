import { EN } from "./en";

type Locale = "en";
type Dict = typeof EN;

const DICTS: Record<Locale, Dict> = { en: EN };

export function t(locale: Locale, key: keyof Dict, vars: Record<string, string> = {}): string {
  const template = DICTS[locale][key];
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}