import { z } from 'zod';

export enum PhoneNumberTypeEnum {
  Business = "Business",
  Home = "Home",
  Mobile = "Mobile"
}

export interface PhoneNumber {
  id?: any,
  number: string;
  type: PhoneNumberTypeEnum;
}

export const newPhoneNumber = (type: PhoneNumberTypeEnum): PhoneNumber => {
  let newPhoneNumber: PhoneNumber = {
    id: null,
    type: type,
    number: ""
  };

  return newPhoneNumber;
}

const phoneRegex = new RegExp(/^(\s*|(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:([\(]{1}))?(?:([0-9]{3}))?(?:([\)]{1}))?\s*(?:[.-]\s*)?)([0-9]{3})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?)\s*(\d+)\s*)?)$/);

export const PhoneNumberSchema = z.object({
  id: z.any().nullable(),
  type: z.nativeEnum(PhoneNumberTypeEnum),
  number: z.string().min(0).regex(phoneRegex, { message: "phoneNumber.validation.phoneNumberFormat" }),
});
