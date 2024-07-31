import { z } from 'zod';

export interface Address {
  civicNumber: string;
  streetName: string;
  appartment: string;
  city: string;
  state: string;
  zipCode: string;
}

export const newAddress = (): Address => {
  let newAddress: Address = {
    civicNumber: "",
    streetName: "",
    appartment: "",
    city: "",
    state: "",
    zipCode: ""
  };

  return newAddress;
}

export function formatAddress(address: Address): String {
  if (!address) {
    return "";
  }
 
  const civicNumber = address.civicNumber && address.civicNumber;
  const streetName = address.streetName && address.streetName;
  const appartment = address.appartment && address.appartment;
  const city = address.city && address.city;
  const state = address.state && address.state;
  const zipCode = address.zipCode && address.zipCode;

  return `${civicNumber} ${streetName} ${appartment}, ${city}, ${state} ${zipCode}`;
}

const zipCodeRegex = new RegExp(/^\d{5}$|(^\d{5}-\d{4}$)|[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d/);

export const AddressSchema = z.object({
  civicNumber: z.string().min(1, { message: "address.validation.civicNumberRequired"  }),
  streetName: z.string().min(1, { message: "address.validation.streetRequired" }),
  appartment: z.string().min(0),
  city: z.string().min(1, { message: "address.validation.cityRequired" }),
  state: z.string().min(2, { message: "address.validation.stateRequired" }),
  zipCode: z.string().regex(zipCodeRegex, { message: "address.validation.zipcodeFormat" }),
});

export const AddressSchemaOptional = z.object({
  civicNumber: z.string().min(0),
  streetName: z.string().min(0),
  appartment: z.string().min(0),
  city: z.string().min(0),
  state: z.string().min(0),
  zipCode: z.string().min(0).regex(zipCodeRegex, { message: "address.validation.zipcodeFormat" }).or(z.literal("")),
});