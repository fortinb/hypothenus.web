import moment from "moment";
import { Address, AddressSchema, AddressSchemaOptional, newAddress } from "./address";
import { Contact, ContactSchema, parseContact } from "./contact";
import { LanguageEnum } from "./language";
import { newPhoneNumber, PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum } from "./phoneNumber"
import { z } from 'zod';

export interface Person {
  firstname: string;
  lastname: string;
  dateOfBirth: any;  // Make dateOfBirth required (was optional with ?)
  email: string;
  address: Address;
  phoneNumbers: PhoneNumber[];
  contacts: Contact[];
  photoUri?: any;
  communicationLanguage: LanguageEnum
  note: string;
}

export const newPerson = (): Person => {
  let newPerson: Person = {
    firstname: "",
    lastname: "",
    dateOfBirth: undefined,
    photoUri: undefined,
    email: "",
    address: newAddress(),
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Home),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)],
    contacts: [],
    communicationLanguage: LanguageEnum.fr,
    note: ""
  };

  return newPerson;
}

export const parsePerson = (data: any): Person => {
  let person: Person = data;

  if (data.dateOfBirth) {
    person.dateOfBirth = moment(data.dateOfBirth).toDate().toISOString();
  }

  if (!person.phoneNumbers) {
    person.phoneNumbers = [];
  }

  // Ensure at least one Mobile and one Home phone number
  const hasMobile = person.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Mobile);
  const hasHome = person.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Home);

  if (!hasHome) {
    person.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Home));
  }

  if (!hasMobile) {
    person.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Mobile));
  }

  // Parse each contact in the person's contacts array
  person.contacts = person.contacts?.map(contact => parseContact(contact));

  return person;
}

export function formatPersonName(person: Person): string {
  return `${person?.firstname ?? ""} ${person?.lastname ?? ""}`;
}

export const PersonSchema = z.object({
  firstname: z.string().min(1, { message: "person.validation.firstnameRequired" }),
  lastname: z.string().min(1, { message: "person.validation.lastnameRequired" }),
  dateOfBirth: z.any().nullable(),
  email: z.email("validation.emailInvalid"),
  address: AddressSchemaOptional,
  phoneNumbers: z.array(PhoneNumberSchema).min(2),
  contacts: z.array(ContactSchema).min(0),
  communicationLanguage: z.enum(LanguageEnum),
  note: z.string().min(0)
});

export const PersonRegistrationSchema = z.object({
  firstname: z.string().min(1, { message: "person.validation.firstnameRequired" }),
  lastname: z.string().min(1, { message: "person.validation.lastnameRequired" }),
  dateOfBirth: z.any().nonoptional({ message: "person.validation.dateOfBirthRequired" }),
  email: z.email("validation.emailInvalid"),
  phoneNumbers: z.array(PhoneNumberSchema).min(2),
  communicationLanguage: z.enum(LanguageEnum),
});