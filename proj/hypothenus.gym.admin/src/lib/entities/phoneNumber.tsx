export interface PhoneNumber {
   regionalCode: string;
   number: string;
   type: PhoneNumberTypeEnum;
}

export enum PhoneNumberTypeEnum {
  Business,
  Home,
  Mobile
}