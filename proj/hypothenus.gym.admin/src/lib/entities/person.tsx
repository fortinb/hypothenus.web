import { Address, AddressSchema, newAddress } from "./address";
import { Contact, ContactSchema } from "./contact";
import { LanguageEnum } from "./language";
import { newPhoneNumber, PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum } from "./phoneNumber"
import { z } from 'zod';

export interface Person {
  firstname: string;
  lastname: string;
  dateOfBirth?: Date;
  email?: string;
  address: Address;
  phoneNumbers: PhoneNumber[];
  emergencyContacts: Contact[];
  photoUri: string;
  communicationLanguage : LanguageEnum
  note: string;
}

export const newPerson = (): Person => {
  let newPerson: Person = {
    firstname: "",
    lastname: "",
    dateOfBirth: undefined,
    photoUri: "",
    email: undefined,
    address: newAddress(),
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Home),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)],
    emergencyContacts: [],
    communicationLanguage: LanguageEnum.en,
    note: ""
  };

  return newPerson;
}

export function formatName(person: Person): string {
  return `${person?.firstname ?? ""} ${person?.lastname ?? ""}`;
}

export const PersonSchema = z.object({
  id: z.any().nullable(),
  firstname: z.string().min(1, {message: "person.validation.firstnameRequired"}),
  lastname: z.string().min(1, {message: "person.validation.lastnameRequired"}),
  dateOfBirth: z.date().optional(),
  email: z.string().min(0).email("validation.emailInvalid").optional().or(z.literal("")),
  address: AddressSchema,
  phoneNumbers: z.array(PhoneNumberSchema).min(2),
  emergencyContacts: z.array(ContactSchema).min(0),
  photoUri: z.string().min(0),
  communicationLanguage: z.nativeEnum(LanguageEnum),
  note: z.string().min(0),
});