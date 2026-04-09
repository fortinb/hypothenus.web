"use client";

import MembershipPlanCard from "@/app/ui/components/membership-plan/membership-plan-card";
import ModalBuyMembershipPlan from "@/app/ui/components/membership/modal-buy-membership-plan";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function MembershipPlansListDetails({ lang, membershipPlan }: { lang: string; membershipPlan: MembershipPlan }) {
  const t = useTranslations("entity");
  const [showMembershipPlanDetailModal, setShowMembershipPlanDetailModal] = useState(false);
   const [buyingMembershipPlan, setBuyingMembershipPlan] = useState(false);

  function onBuy(addToCart: boolean, buyNow: boolean, membershipPlan: MembershipPlan) {
    setBuyingMembershipPlan(true);  

    // add to cart, or buy now logic here, using the membershipPlan parameter


    setShowMembershipPlanDetailModal(false)
      setBuyingMembershipPlan(false);  
  }

  return (
    <div className="col-6 p-2">
      <div className="clickable" onClick={() => setShowMembershipPlanDetailModal(true)}>
        <MembershipPlanCard
          membershipPlan={membershipPlan}
          locale={lang}
          tLocale={t}
          linkActive={false}
        />
      </div>
      <ModalBuyMembershipPlan membershipPlan={membershipPlan} tLocale={t} onlyDisplay={false} locale={lang} 
        isAction={buyingMembershipPlan} 
        show={showMembershipPlanDetailModal} handleResult={onBuy} />
    </div>
  );
}
