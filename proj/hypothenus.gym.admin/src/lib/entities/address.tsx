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
  const appartment = address?.appartment !== "" ? ", " + address.appartment : "";

  return address.civicNumber + " " + address.streetName + appartment + ", " +
    address.city + ", " + address.state + " " + address.zipCode;
}

const zipCodeRegex = new RegExp(/^\d{5}$|(^\d{5}-\d{4}$)|[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d/);

export const AddressSchema = z.object({
  civicNumber: z.string().min(1, { message: "Civic number is required" }),
  streetName: z.string().min(1, { message: "Street name is required" }),
  appartment: z.string().min(0),
  city: z.string().min(1, { message: "City name is required" }),
  state: z.string().min(2, { message: "Province is required" }),
  zipCode: z.string().regex(zipCodeRegex, { message: "A9A 9A9" }),
});