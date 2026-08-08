"use client";

import { useTranslations } from "next-intl";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import MembershipPlanCardInfo from "@/app/ui/components/membership-plan/membership-plan-card-info";
import { useRouter } from "next/navigation";

export default function MembershipPlanListDetails({ lang, brandId, membershipPlan }:
  {
    lang: string;
    brandId: string;
    membershipPlan: MembershipPlan
  }) {
  const t = useTranslations("entity");

  return (
    <div className="col-6 p-2">
      <MembershipPlanCardInfo
        key={0}
        membershipPlan={membershipPlan}
        lang={lang}
        tLocale={t}
        onMembershipPlanAction ={() => { }}
        linkActive={true}
        linkUri={`/${lang}/admin/brands/${brandId}/membership-plans/${membershipPlan.uuid}`}
        onlyDisplay={true}
      />
    </div>
  );
}
