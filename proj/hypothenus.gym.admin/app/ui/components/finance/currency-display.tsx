"use client"

import { Currency } from "@/src/lib/entities/finance/currency";

export default function CurrencyDisplay({ currency }: { currency: Currency }) {

  return (
    <div>
      <div className="d-flex flex-row justify-content-star">
        <span className="text-primary">{currency.code} - {currency.name} - {currency.symbol}</span>
      </div>
    </div>
  );
}
