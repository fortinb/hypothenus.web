"use client";

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MembershipPlanCard from "./membership-plan-card";
export default function MembershipPlansListDetails({ lang, brandId, membershipPlan }:
  {
    lang: string;
    brandId: string;
    membershipPlan: MembershipPlan
  }) {
  const t = useTranslations("entity");
  const router = useRouter();

  return (
    <div className="col-6 p-2">

        <MembershipPlanCard
          membershipPlan={membershipPlan}
          lang={lang}
          tLocale={t}
          brandId={brandId}
          />
    </div>
  );
}
