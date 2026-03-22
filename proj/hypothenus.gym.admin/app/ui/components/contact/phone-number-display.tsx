"use client"

import { PhoneNumber } from "@/src/lib/entities/phone-number";
import { useTranslations } from "next-intl";

export default function PhoneNumberDisplay({ phoneNumber }: { phoneNumber: PhoneNumber }) {
  const t = useTranslations("entity");

  return (
    <div>
      <span className="text-primary">{phoneNumber.number} </span>
      <span className="text-primary-small">({t(`phoneNumber.${phoneNumber.type}`)})</span>
    </div>
  );
}
