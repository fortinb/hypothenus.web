export const localesConfig = {
  locales: ["en", "fr"],
  defaultLocale: "en",
} as const;

export const localesConfigLanguageOrder: Record<string, number> = {
  'en': 1,  // 'en' first
  'fr': 2,  // 'fr' second
};