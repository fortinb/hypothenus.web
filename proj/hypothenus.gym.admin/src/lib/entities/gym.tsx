import { Address, AddressSchema, newAddress } from "./address"
import { BaseEntity } from "./baseEntity";
import { Contact, ContactSchema, newContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum, newPhoneNumber } from "./phoneNumber"
import { SocialMediaAccount } from "./socialMediaAccount"
import { z } from 'zod';

export interface Gym extends BaseEntity {
  id: string;
  gymId: string;
  name: string;
  address: Address;
  email: string;
  active: boolean;
  note: string;
  contacts: Contact[];
  phoneNumbers: PhoneNumber[];
  socialMediaAccounts: SocialMediaAccount[];
}

export const newGym = (): Gym => {
  let newGym: Gym = {
    id: "",
    gymId: "",
    name: "",
    address: newAddress(),
    email: "",
    active: true,
    note: "",
    contacts: [
      newContact(),
    ],
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Business),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)],
    socialMediaAccounts: [],
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newGym;
}

export const GymSchema = z.object({
  gymId: z.string().min(1, { message: "Code is required" }).max(20, { message: "Maximum length for Gym Code is 20 characters" }),
  name: z.string().max(100, { message: "Maximum length for Name is 100 characters" }).min(1, { message: "Name is required" }),
  address: AddressSchema,
  email: z.string().email({ message: "Email format is invalid" }),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(1),
  contacts: z.array(ContactSchema).min(1)
});