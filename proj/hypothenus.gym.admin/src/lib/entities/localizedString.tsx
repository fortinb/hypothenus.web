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

export const LocalizedStringSchema = z.object({
  language: z.nativeEnum(LanguageEnum),
  text: z.string().min(1, {message: "validation.descriptionRequired"})
});