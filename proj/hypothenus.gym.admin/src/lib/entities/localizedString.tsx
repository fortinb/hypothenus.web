import { z } from "zod";
import { LanguageEnum } from "./language";

export interface LocalizedString {
  language: LanguageEnum;
  text: string;
}

export const newLocalizedString = (language: LanguageEnum): LocalizedString => {
  let newLocalizedString: LocalizedString = {
    language: language,
    text: ""
  };

  return newLocalizedString;
}

export const LocalizedStringSchema = (required: boolean, message: string) => {
  return z.object({
    language: z.nativeEnum(LanguageEnum),
    text: z.string().min(required ? 1 : 0, {message: `${message}`})
  });
} 