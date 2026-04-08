"use client"

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import MembershipPlansListDetails from "./membership-plans-list-details";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { membershipPlanOrder } from "./page";
import { useTranslations } from "next-intl";
import { MembershipPlanFilterState } from "@/app/lib/store/slices/membership-plans-filter-state-slice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function MembershipPlansList({ lang, membershipPlans }:
  {
    lang: string;
    membershipPlans?: MembershipPlan[]
  }) {
  const t = useTranslations("entity");

  const membershipPlanFilterState: MembershipPlanFilterState = useSelector((state: any) => state.membershipPlanFilterState);

  const [promotionalPlans, setPromotionalPlans] = useState<MembershipPlan[]>([]);
  const [giftCardPlans, setGiftCardPlans] = useState<MembershipPlan[]>([]);
  const [regularPlans, setRegularPlans] = useState<MembershipPlan[]>([]);

  const periods = Object.values(MembershipPlanPeriodEnum).sort(
    (a, b) => (membershipPlanOrder[a] ?? 999) - (membershipPlanOrder[b] ?? 999)
  );

  useEffect(() => {
    if (membershipPlanFilterState.gymSelectedItem) {
      const filteredPlans = membershipPlans?.filter(mp => mp.includedGyms.some(gym => gym.uuid === membershipPlanFilterState.gymSelectedItem?.gym.uuid)) ?? [];
      const promotionalPlans = filteredPlans?.filter((mp) => mp.promotional) ?? [];
      const giftCardPlans = filteredPlans?.filter((mp) => mp.giftCard) ?? [];
      const regularPlans = filteredPlans?.filter((mp) => !mp.promotional && !mp.giftCard) ?? [];

      setPromotionalPlans(promotionalPlans);
      setGiftCardPlans(giftCardPlans);
      setRegularPlans(regularPlans);
    }
  }, [membershipPlanFilterState.gymSelectedItem]);

  return (
    <div className="d-flex flex-row flex-wrap mt-1 mb-2 ">

      {promotionalPlans.length > 0 && (
        <div className="w-100">
          <div className="d-flex flex-row justify-content-center text-tertiary w-100 mt-4 mb-2">
            <h3>{t("membershipPlan.section.promotional")}</h3>
          </div>
          <div className="d-flex flex-row flex-wrap">
            {promotionalPlans.map((membershipPlan) => (
              <MembershipPlansListDetails key={membershipPlan.uuid} lang={lang} membershipPlan={membershipPlan} />
            ))}
          </div>
          <hr />
        </div>
      )}

      {periods.map((period) => {
        const plansForPeriod = regularPlans.filter((mp) => mp.period === period);
        if (plansForPeriod.length === 0) return null;

        return (
          <div key={period} className="w-100">
            <div className="d-flex flex-row justify-content-center text-tertiary w-100 mt-4 mb-2">
              <h3>{t(`membershipPlan.period.title.${period}`)}</h3>
            </div>
            <div className="d-flex flex-row flex-wrap">
              {plansForPeriod.map((membershipPlan) => (
                <MembershipPlansListDetails key={membershipPlan.uuid} lang={lang} membershipPlan={membershipPlan} />
              ))}
            </div>
            <hr />
          </div>
        );
      })}

      {giftCardPlans.length > 0 && (
        <div className="w-100">
          <div className="d-flex flex-row justify-content-center text-tertiary w-100 mt-4 mb-2">
            <h3>{t("membershipPlan.section.giftCard")}</h3>
          </div>
          <div className="d-flex flex-row flex-wrap">
            {giftCardPlans.map((membershipPlan) => (
              <MembershipPlansListDetails key={membershipPlan.uuid} lang={lang} membershipPlan={membershipPlan} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
