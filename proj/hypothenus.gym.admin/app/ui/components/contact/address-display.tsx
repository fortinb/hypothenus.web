"use client"

import { Address } from "@/src/lib/entities/contact/address";

export default function AddressDisplay({ address, alignCenter = true }: { address: Address, alignCenter?: boolean }) {

  const justifyClass = alignCenter ? "justify-content-center" : "justify-content-start";

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
