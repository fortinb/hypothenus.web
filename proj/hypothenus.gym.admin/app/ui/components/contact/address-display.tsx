"use client"

import { Address } from "@/src/lib/entities/contact/address";

export default function AddressDisplay({ address, align = "center" }: { address: Address, align?: string }) {

  const justifyClass = `justify-content-${align}`;

  return (
    <div>
      <div className={`d-flex flex-row ${justifyClass}`}>
        <span className="text-primary">{address.civicNumber} {address.streetName} {address.appartment !== "" ? `#${address.appartment}` : ""  }</span>
      </div>
      <div className={`d-flex flex-row ${justifyClass}`}>
        <span className="text-primary">{address.city}, {address.state}, {address.country}</span>
      </div>
      <div className={`d-flex flex-row ${justifyClass}`}>
        <span className="text-primary">{address.zipCode}</span>
      </div>
    </div>
  );
}
