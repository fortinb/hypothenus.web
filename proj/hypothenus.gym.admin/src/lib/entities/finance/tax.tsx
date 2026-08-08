import { LanguageEnum } from "../enum/language-enum";
import { LocalizedString } from "../localized/localized-string";
import { Cost, parseCost, serializeCost } from "./cost";
import { localesConfig } from "@/i18n/locales-client";

export interface Tax {
    code: LocalizedString[];
    name: LocalizedString[];
    authority: string;
    jurisdiction: string;
    registrationNumber: string;
    rate: number;
    taxableAmount: Cost;
    taxAmount: Cost;
    isIncludedInPrice: boolean;
}

export const parseTax = (data: any): Tax => {
    let tax: Tax = {
        ...data,
        taxableAmount: parseCost(data.taxableAmount),
        taxAmount: parseCost(data.taxAmount),
    };

    return tax;
}

export const serializeTax = (tax: Tax): any => {
    return {
        ...tax,
        taxableAmount: serializeCost(tax.taxableAmount),
        taxAmount: serializeCost(tax.taxAmount),
    };
}

export function getTaxName(tax: Tax, language?: LanguageEnum): string {

  let name = tax.name?.find(c => c.language === language);
  if (!name) {
    name = tax.name?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
  }

  return name?.text ?? "";
}

export function getTaxCode(tax: Tax, language?: LanguageEnum): string {

  let code = tax.code?.find(c => c.language === language);
  if (!code) {
    code = tax.code?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
  }

  return code?.text ?? "";
}
