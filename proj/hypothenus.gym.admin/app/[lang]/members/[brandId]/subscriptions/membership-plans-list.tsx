"use client"

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import MembershipPlanListDetails from "./membership-plans-list-details";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { membershipPlanOrder } from "./page";
import { useTranslations } from "next-intl";

export default function MembershipPlansList({ lang, membershipPlans }:
  {
    lang: string;
    membershipPlans?: MembershipPlan[]
  }) {
  const t = useTranslations("entity");

  const periods = Object.values(MembershipPlanPeriodEnum).sort(
    (a, b) => (membershipPlanOrder[a] ?? 999) - (membershipPlanOrder[b] ?? 999)
  );

  return (
    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {periods.map((period) => {
        const plansForPeriod = membershipPlans?.filter((mp) => mp.period === period) ?? [];
        if (plansForPeriod.length === 0) return null;

        return (
          <div key={period} className="w-100">
            <div className="text-tertiary w-100 mt-4 mb-2">
              <h3>{t(`membershipPlan.period.title.${period}`)}</h3>
            </div>
            <div className="d-flex flex-row flex-wrap">
              {plansForPeriod.map((membershipPlan) => (
                <MembershipPlanListDetails key={membershipPlan.uuid} lang={lang} membershipPlan={membershipPlan} />
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}
