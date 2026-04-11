"use client";

import MembershipPlanCard from "@/app/ui/components/membership-plan/membership-plan-card";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTranslations } from "next-intl";

export default function MembershipPlansListDetails({ lang, membershipPlan }: { lang: string; membershipPlan: MembershipPlan }) {
  const t = useTranslations("entity");

  return (
    <div className="col-6 p-2">
      <MembershipPlanCard
        membershipPlan={membershipPlan}
        lang={lang}
        tLocale={t}
        linkActive={false}
      />
    </div>
  );
}
