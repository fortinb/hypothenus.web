"use client"

import i18n from "i18next";
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useCookies } from "react-cookie";
import LanguageDetector from "i18next-browser-languagedetector";
import { useEffect } from "react";

export const fallbackLanguage = "en";
export const supportedLanguages = [fallbackLanguage, "fr"]
export const languageCookieName = "language";
export const defaultNamespace = "translation";
const runsOnServerSide = typeof window === 'undefined'

i18n
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    load: "languageOnly",
    supportedLngs: supportedLanguages,
    fallbackLng: fallbackLanguage,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns: defaultNamespace,
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      // order and from where user language should be detected
      order: ["path", "querystring", "cookie", "localStorage", "navigator", "htmlTag", "subdomain"],

      // keys or params to lookup language from
      lookupQuerystring: "language",
      lookupCookie: languageCookieName,
      lookupLocalStorage: languageCookieName,
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ["cookie", "localStorage"],
      excludeCacheFor: ["cimode"] // languages to not persist (cookie, localStorage)
    },
    preload: runsOnServerSide ? supportedLanguages : []
  });

export function changeLanguage(language: string) {
  i18n.changeLanguage(language);
}

export function useTranslation(namespace?: string, language?: string) {
  const [cookies] = useCookies([languageCookieName]);

  const translation = useTranslationOriginal(namespace);
  if (runsOnServerSide && language && !supportedLanguages.includes(language)) {
    return translation;
  }

  const { i18n } = translation
  if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
    console.log("i18n on server change language " + language);
    i18n.changeLanguage(language);
  } else {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies.language === i18n.resolvedLanguage) {
        return;
      }

      console.log ("cookie  change lalguage " + cookies.language);
      i18n.changeLanguage(cookies.language);
    }, [i18n, language, cookies.language]);
  }

  return translation;
}

export default i18n;