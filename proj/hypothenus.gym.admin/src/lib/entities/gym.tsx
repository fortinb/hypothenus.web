import { z } from 'zod';
import { Address, AddressSchema, newAddress } from "./address";
import { BaseEntity } from "./baseEntity";
import { Contact, ContactSchema, newContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum, newPhoneNumber } from "./phoneNumber";
import { SocialMediaAccount } from "./socialMediaAccount";

export interface Gym extends BaseEntity {
  id: string;
  gymId: string;
  name: string;
  address: Address;
  email?: string;
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
    email: undefined,
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
  gymId: z.string().min(1, { message: "gym.validation.codeRequired"}).max(20, { message:"gym.validation.codeMaxLength"}),
  name: z.string().min(1, { message:  "gym.validation.nameRequired" }).max(100, { message: "gym.validation.ameMaxLength"}),
  address: AddressSchema,
  email: z.string().min(0).email("gym.validation.emailInvalid").optional().or(z.literal("")),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(1),
  contacts: z.array(ContactSchema).min(1)
});