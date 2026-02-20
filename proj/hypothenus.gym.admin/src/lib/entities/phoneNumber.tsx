import { z } from 'zod';

export enum PhoneNumberTypeEnum {
  Business = "business",
  Home = "home",
  Mobile = "mobile"
}

export const phoneNumberOrder: Record<string, number> = {
  "home": 1,
  "business": 2,
  "mobile": 3
};

export interface PhoneNumber {
  number: string;
  type: PhoneNumberTypeEnum;
}

export const newPhoneNumber = (type: PhoneNumberTypeEnum): PhoneNumber => {
  let newPhoneNumber: PhoneNumber = {
    type: type,
    number: ""
  };

  return newPhoneNumber;
}

const phoneRegex = new RegExp(/^(\s*|(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:([\(]{1}))?(?:([0-9]{3}))?(?:([\)]{1}))?\s*(?:[.-]\s*)?)([0-9]{3})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?)\s*(\d+)\s*)?)$/);

export const PhoneNumberSchema = z.object({
  type: z.enum(PhoneNumberTypeEnum),
  number: z.string().min(0).regex(phoneRegex, { message: "phoneNumber.validation.phoneNumberFormat" }),
});
