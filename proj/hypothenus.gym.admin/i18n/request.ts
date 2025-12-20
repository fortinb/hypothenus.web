// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { loadMessages } from "./load-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // Decide locale based on routing or fallback
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

    const messages = await loadMessages(locale);  
    
  return {
    locale,
    messages: messages,
  };
});
