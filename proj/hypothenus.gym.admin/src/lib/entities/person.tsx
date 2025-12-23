import moment from "moment";
import { Address, AddressSchema, AddressSchemaOptional, newAddress } from "./address";
import { Contact, ContactSchema } from "./contact";
import { LanguageEnum } from "./language";
import { newPhoneNumber, PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum } from "./phoneNumber"
import { z } from 'zod';

export interface Person {
  firstname: string;
  lastname: string;
  dateOfBirth?: any; 
  email?: string;
  address: Address;
  phoneNumbers: PhoneNumber[];
  contacts: Contact[];
  photoUri?: any;
  communicationLanguage : LanguageEnum
  note: string;
}

export const newPerson = (): Person => {
  let newPerson: Person = {
    firstname: "",
    lastname: "",
    dateOfBirth: undefined,
    photoUri: undefined,
    email: undefined,
    address: newAddress(),
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Home),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)],
    contacts: [],
    communicationLanguage: LanguageEnum.en,
    note: ""
  };

  return newPerson;
}

export const parsePerson = (data: any): Person => {
  let person: Person = data;

  if (data.dateOfBirth) {
    person.dateOfBirth = moment(data.dateOfBirth).toDate().toISOString();
  }

  return person;
}

export function formatPersonName(person: Person): string {
  return `${person?.firstname ?? ""} ${person?.lastname ?? ""}`;
}

export const PersonSchema = z.object({
  id: z.any().nullable(),
  firstname: z.string().min(1, {message: "person.validation.firstnameRequired"}),
  lastname: z.string().min(1, {message: "person.validation.lastnameRequired"}),
  dateOfBirth: z.any().nullable(),
  email: z.string().min(0).email("validation.emailInvalid").optional().or(z.literal("")),
  address: AddressSchemaOptional,
  phoneNumbers: z.array(PhoneNumberSchema).min(2),
  contacts: z.array(ContactSchema).min(0),
  photoUri: z.any().nullable().optional(),
  communicationLanguage: z.nativeEnum(LanguageEnum),
  note: z.string().min(0),
});