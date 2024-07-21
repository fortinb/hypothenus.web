"use client"

import i18n from "i18next";
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next'
import EnglishTranslation from "./locales/english";
import FrenchTranslation from "./locales/french";
import Backend from "i18next-http-backend";
import { useCookies } from "react-cookie";
import LanguageDetector from "i18next-browser-languagedetector";
import { useEffect, useState } from "react";

const fallbackLanguage = "en";
export const supportedLanguages = [fallbackLanguage, "fr"]
const cookieName = "language";
export const defaultNamespace = "translation";
const runsOnServerSide = typeof window === 'undefined'

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: EnglishTranslation,
      },
      fr: {
        translation: FrenchTranslation,
      },
    },
   
    supportedLngs: supportedLanguages,
    fallbackLng: fallbackLanguage,
    fallbackNS:defaultNamespace,
    defaultNS:defaultNamespace,
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
      lookupCookie: cookieName,
      lookupLocalStorage: cookieName,
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    
      // cache user language on
      caches: ["cookie", "localStorage"],
      excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)
    
      // optional expire and domain for set cookie
      //cookieMinutes: 10,
      //cookieDomain: "myDomain",
    
      // optional htmlTag with lang attribute, the default is:
      //htmlTag: document.documentElement
    },
    preload: runsOnServerSide ? supportedLanguages : []
  });

  export function changeLanguage (language: string) {
    i18n.changeLanguage(language);
  }

  export function useTranslation(language: string) {
    const [cookies, setCookie] = useCookies([cookieName]);

    const translationResponse = useTranslationOriginal();

    const { i18n } = translationResponse
    if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
      i18n.changeLanguage(language);
    } else {
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (activeLng === i18n.resolvedLanguage) {
          return;
        }

        setActiveLng(i18n.resolvedLanguage);
       
      }, [activeLng, i18n.resolvedLanguage]);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (!language || i18n.resolvedLanguage === language) {
          return;
        } 

        i18n.changeLanguage(language);
      }, [language, i18n]);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (cookies.language === language) {
          return;
        }

        setCookie(cookieName, language, { path: '/' });
      }, [language, cookies.language]);
    }

    return translationResponse;
  }

export default i18n;