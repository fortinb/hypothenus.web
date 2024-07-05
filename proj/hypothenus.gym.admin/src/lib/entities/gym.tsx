import { Address } from "./address"
import { PhoneNumber } from "./phoneNumber"
import { SocialMediaAccount } from "./socialMediaAccount"

export interface Gym {
    gymId: string;
    name: string;
    address: Address;
    email: string;
    language: string;
    active: boolean;
    phoneNumbers: PhoneNumber[];
    socialMediaAccounts: SocialMediaAccount[];
  }