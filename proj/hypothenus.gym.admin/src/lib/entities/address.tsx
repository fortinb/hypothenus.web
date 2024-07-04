export interface Address {
  civicNumber: string;
  streetName: string;
  appartment: string;
  city: string;
  state: string;
  zipCode: string;
}

export function formatAddress(address: Address): String {
  const appartment = address?.appartment !== "" ? ", " + address.appartment : "";
  
  return address.civicNumber + " " + address.streetName + appartment + ", " + 
         address.city + ", " + address.state + " " + address.zipCode;
}