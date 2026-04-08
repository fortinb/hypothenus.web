"use client";

import { useTranslations } from "next-intl";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import MembershipPlanCard from "@/app/ui/components/membership-plan/membership-plan-card";

export default function MembershipPlansListDetails({ lang, membershipPlan }: { lang: string; membershipPlan: MembershipPlan }) {
  const t = useTranslations("entity");

  return (
    <div className="col-6 p-2">
      <MembershipPlanCard
        key={0}
        membershipPlan={membershipPlan}
        locale={lang}
        tLocale={t}
        linkActive={false}
      />
    </div>
  );
}
