import { PhoneNumber, PhoneNumberSchema } from "./phoneNumber"
import { z } from 'zod';

export interface Contact {
    firstname: string;
    lastname: string;
    description: string;
    email: string;
    phoneNumbers: PhoneNumber[];
  }

  export const  newContact = () : Contact => {
    let newContact : Contact = {
      firstname: "",
      lastname: "",
      description: "",
      email: "",
      phoneNumbers: []
    };

    return newContact;
  } 

  export const ContactSchema = z.object({
    firstname: z.string().min(1, { message: "Firstname is required"}),
    lastname: z.string().min(1, { message: "Lastname is required"}),
    description: z.string().min(1, { message: "Description is required"}),
    email: z.string().email("Email format is invalid").min(0),
    phoneNumbers: z.array(PhoneNumberSchema).min(0),
  });