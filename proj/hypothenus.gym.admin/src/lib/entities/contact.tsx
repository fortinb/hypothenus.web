import { newPhoneNumber, PhoneNumber, PhoneNumberSchema } from "./phone-number";
import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";
import { z } from 'zod';

export interface Contact {
  firstname: string;
  lastname: string;
  description: string;
  email?: string;
  phoneNumbers: PhoneNumber[];
  id?: any;
}

export const newContact = (): Contact => {
  let newContact: Contact = {
    firstname: "",
    lastname: "",
    description: "",
    email: undefined,
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.home),
      newPhoneNumber(PhoneNumberTypeEnum.mobile)]
  };

  return newContact;
}

export const parseContact = (data: any): Contact => {
  let contact: Contact = data;

  if (!contact.phoneNumbers) {
    contact.phoneNumbers = [];
  }
  
  // Ensure at least one Mobile and one Home phone number
  const hasMobile = contact.phoneNumbers.some(pn => pn.type === PhoneNumberTypeEnum.mobile);
  const hasHome = contact.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.home);

  if (!hasHome) {
    contact.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.home));
  }

  if (!hasMobile) {
    contact.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.mobile));
  }

  return contact;
}

export const serializeContact = (contact: Contact): any => {
  return { ...contact };
}

export function formatContactName(contact: Contact): string {
  return (contact?.firstname ?? "") + " " + (contact?.lastname ?? "");
}

export const ContactSchema = z.object({
  firstname: z.string().min(1, { message: "person.validation.firstnameRequired" }),
  lastname: z.string().min(1, { message: "person.validation.lastnameRequired" }),
  description: z.string().min(1, { message: "person.validation.descriptionRequired" }),
  email: z.email("validation.emailInvalid").optional().or(z.literal("")),
  phoneNumbers: z.array(PhoneNumberSchema).min(0)
});