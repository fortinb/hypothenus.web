import { newPhoneNumber, PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum } from "./phoneNumber"
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
    id: null,
    firstname: "",
    lastname: "",
    description: "",
    email: undefined,
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Home),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)]
  };

  return newContact;
}

export const parseContact = (data: any): Contact => {
  let contact: Contact = data;

  // Ensure at least one Mobile and one Business phone number
  const hasMobile = contact.phoneNumbers.some(pn => pn.type === PhoneNumberTypeEnum.Mobile);
  const hasBusiness = contact.phoneNumbers.some(pn => pn.type === PhoneNumberTypeEnum.Business);

  if (!hasMobile) {
    contact.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Mobile));
  }

  if (!hasBusiness) {
    contact.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Business));
  }

  return contact;
}

export function formatContactName(contact: Contact): string {
  return (contact?.firstname ?? "") + " " + (contact?.lastname ?? "");
}

export const ContactSchema = z.object({
  id: z.any().nullable(),
  firstname: z.string().min(1, {message: "person.validation.firstnameRequired"}),
  lastname: z.string().min(1, {message: "person.validation.lastnameRequired"}),
  description: z.string().min(1, {message: "person.validation.descriptionRequired"}),
  email: z.string().min(0).email("validation.emailInvalid").optional().or(z.literal("")),
  phoneNumbers: z.array(PhoneNumberSchema).min(0)
});