import { z } from 'zod';
import { Address, AddressSchema, newAddress } from "./address";
import { BaseEntity } from "./base-entity";
import { Contact, ContactSchema, newContact, parseContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, newPhoneNumber } from "./phone-number";
import { PhoneNumberTypeEnum } from './enum/phone-number-type-enum';

export interface Gym extends BaseEntity {
  brandUuid?: any;
  uuid?: any;
  code: string;
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
    uuid: null,
    brandUuid: null,
    code: "",
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
      newPhoneNumber(PhoneNumberTypeEnum.business),
      newPhoneNumber(PhoneNumberTypeEnum.mobile)],
    messages: [],
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newGym;
}

export const parseGym = (data: any): Gym => {
  let gym: Gym = data;

  if (!gym.phoneNumbers) {
    gym.phoneNumbers = [];
  }

  // Ensure at least one Mobile and one Business phone number
  const hasBusiness = gym.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.business);
  const hasMobile = gym.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.mobile);

  if (!hasBusiness) {
    gym.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.business));
  }

  if (!hasMobile) {
    gym.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.mobile));
  }

  // Parse each contact in the contacts array
  gym.contacts = gym.contacts?.map(contact => parseContact(contact));

  return gym;
}

export const serializeGym = (gym: Gym): any => {
  return { ...gym };
}

export const GymSchema = z.object({
  code: z.string().trim().min(1, { message: "gym.validation.codeRequired" }).max(20, { message: "gym.validation.codeMaxLength" }).regex(/^\S+$/, "gym.validation.noSpaceAllowed"),
  name: z.string().min(1, { message: "gym.validation.nameRequired" }).max(100, { message: "gym.validation.nameMaxLength" }),
  address: AddressSchema,
  email: z.email("gym.validation.emailInvalid").optional().or(z.literal("")),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(2),
  contacts: z.array(ContactSchema)
});

export const GymReferenceSchema = z.object({
  uuid: z.any().nullable(),
  brandUuid: z.string().min(1)
});