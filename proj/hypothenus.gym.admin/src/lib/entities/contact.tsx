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

export function formatName(contact: Contact): string {
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