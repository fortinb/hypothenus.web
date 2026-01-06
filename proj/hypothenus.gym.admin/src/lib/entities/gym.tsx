import { z } from 'zod';
import { Address, AddressSchema, newAddress } from "./address";
import { BaseEntity } from "./baseEntity";
import { Contact, ContactSchema, newContact, parseContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum, newPhoneNumber } from "./phoneNumber";

export interface Gym extends BaseEntity {
  id?: any;
  brandId: string;
  gymId: string;
  name: string;
  address: Address;
  email?: string;
  logoUri?: any;
  isActive: boolean;
  note: string;
  contacts: Contact[];
  phoneNumbers: PhoneNumber[];
}

export const newGym = (): Gym => {
  let newGym: Gym = {
    id: null,
    brandId: "",
    gymId: "",
    name: "",
    address: newAddress(),
    email: undefined,
    logoUri: undefined,
    isActive: true,
    note: "",
    contacts: [
      newContact(),
    ],
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Business),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)],
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newGym;
}

export const parseGym = (data: any): Gym => {
  let gym: Gym = data;

  // Ensure at least one Mobile and one Business phone number
  const hasMobile = gym.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Mobile);
  const hasBusiness = gym.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Business);
  
  if (!hasMobile) {
    gym.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Mobile));
  }

  if (!hasBusiness) {
    gym.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Business));
  }

  // Parse each contact in the contacts array
  gym.contacts = gym.contacts?.map(contact => parseContact(contact));

  return gym;
}

export const GymSchema = z.object({
  gymId: z.string().trim().min(1, { message: "gym.validation.codeRequired" }).max(20, { message: "gym.validation.codeMaxLength" }).regex(/^\S+$/, "gym.validation.noSpaceAllowed"),
  name: z.string().min(1, { message: "gym.validation.nameRequired" }).max(100, { message: "gym.validation.ameMaxLength" }),
  address: AddressSchema,
  email: z.string().min(0).email("gym.validation.emailInvalid").optional().or(z.literal("")),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(1),
  contacts: z.array(ContactSchema)
});