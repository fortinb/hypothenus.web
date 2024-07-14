import { newPhoneNumber, PhoneNumber, PhoneNumberSchema, PhoneNumberTypeEnum } from "./phoneNumber"
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
      phoneNumbers: [
        newPhoneNumber(PhoneNumberTypeEnum.Home),
        newPhoneNumber(PhoneNumberTypeEnum.Mobile)]
    };

    return newContact;
  } 

  export const ContactSchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    description: z.string().min(1),
    email: z.string().min(1).email("Email format is invalid"),
    phoneNumbers: z.array(PhoneNumberSchema).min(0)
  });