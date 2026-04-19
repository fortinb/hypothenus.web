"use client"

import { Address } from "@/src/lib/entities/contact/address";

export default function AddressDisplay({ address }: { address: Address }) {

  return (
    <div>
      <div className="d-flex flex-row justify-content-center">
        <span className="text-primary">{address.civicNumber} {address.streetName} {address.appartment !== "" ? `#${address.appartment}` : ""  }</span>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <span className="text-primary">{address.city}, {address.state}</span>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <span className="text-primary">{address.zipCode}</span>
      </div>
    </div>
  );
}
