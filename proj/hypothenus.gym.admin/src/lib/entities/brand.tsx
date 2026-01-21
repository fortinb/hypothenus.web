import { z } from 'zod';
import { Address, AddressSchema, newAddress } from "./address";
import { BaseEntity } from "./baseEntity";
import { Contact, ContactSchema, newContact, parseContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum, newPhoneNumber } from "./phoneNumber";

export interface Brand extends BaseEntity {
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

export const newBrand = (): Brand => {
  let newBrand: Brand = {
    uuid: null,
    code: "",
    name: "",
    address: newAddress(),
    email: undefined,
    logoUri: undefined,
    isActive: true,
    note: "",
    contacts: [newContact()],
    phoneNumbers: [
      newPhoneNumber(PhoneNumberTypeEnum.Business),
      newPhoneNumber(PhoneNumberTypeEnum.Mobile)
    ],
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newBrand;
}

export const parseBrand = (data: any): Brand => {
  let brand: Brand = data;

  if (!brand.phoneNumbers) {
    brand.phoneNumbers = [];
  }

  // Ensure at least one Mobile and one Business phone number
  const hasMobile = brand.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Mobile);
  const hasBusiness = brand.phoneNumbers?.some(pn => pn.type === PhoneNumberTypeEnum.Business);

  if (!hasBusiness) {
    brand.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Business));
  }

  if (!hasMobile) {
    brand.phoneNumbers.push(newPhoneNumber(PhoneNumberTypeEnum.Mobile));
  }

  // Parse each contact in the contacts array
  brand.contacts = brand.contacts?.map(contact => parseContact(contact));

  return brand;
}

export const BrandSchema = z.object({
  code: z.string().trim().min(1, { message: "brand.validation.codeRequired" }).max(20, { message: "brand.validation.codeMaxLength" }).regex(/^\S+$/, 'brand.validation.noSpaceAllowed'),
  name: z.string().min(1, { message: "brand.validation.nameRequired" }).max(100, { message: "brand.validation.nameMaxLength" }),
  address: AddressSchema,
  email: z.email("brand.validation.emailInvalid").optional().or(z.literal("")),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(0),
  contacts: z.array(ContactSchema).min(0)
});
