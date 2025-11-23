import { z } from 'zod';
import { Address, AddressSchema, newAddress } from "./address";
import { BaseEntity } from "./baseEntity";
import { Contact, ContactSchema, newContact } from "./contact";
import { PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum, newPhoneNumber } from "./phoneNumber";

export interface Brand extends BaseEntity {
  id?: any;
  brandId: string;
  name: string;
  address: Address;
  email?: string;
  isActive: boolean;
  note: string;
  contacts: Contact[];
  phoneNumbers: PhoneNumber[];
}

export const newBrand = (): Brand => {
  let newBrand: Brand = {
    id: null,
    brandId: "",
    name: "",
    address: newAddress(),
    email: undefined,
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

export const BrandSchema = z.object({
  brandId: z.string().min(1, { message: "brand.validation.codeRequired" }).max(20, { message: "brand.validation.codeMaxLength" }),
  name: z.string().min(1, { message: "brand.validation.nameRequired" }).max(100, { message: "brand.validation.nameMaxLength" }),
  address: AddressSchema,
  email: z.string().min(0).email("brand.validation.emailInvalid").optional().or(z.literal("")),
  note: z.string().min(0),
  phoneNumbers: z.array(PhoneNumberSchema).min(0),
  contacts: z.array(ContactSchema).min(0)
});
