import { AbstractIntlMessages, createTranslator } from "next-intl";
import { localesConfig } from "@/i18n/locales-client";

export type LocaleTranslator = {
  locale: string;
  t: ReturnType<typeof createTranslator>;
};

export function createTranslators(
  namespace: string,
  messagesMap: Record<string, AbstractIntlMessages>
): LocaleTranslator[] {
  return localesConfig.locales.map((locale) => ({
    locale,
    t: createTranslator({ locale, namespace, messages: messagesMap[locale] }),
  }));
}
