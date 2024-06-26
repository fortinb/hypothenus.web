export interface Address {
    civicNumber: string;
    streetName: string;
    appartment: Address;
    city: string;
    state: string;
    zipCode: string;
  }