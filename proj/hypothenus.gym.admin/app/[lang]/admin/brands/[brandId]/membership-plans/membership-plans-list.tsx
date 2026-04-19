"use client"

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Page } from "@/src/lib/entities/paging/page";
import MembershipPlanListDetails from "./membership-plans-list-details";

export default function MembershipPlansList({ lang, pageOfMembershipPlans }: { lang: string; pageOfMembershipPlans?: Page<MembershipPlan> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfMembershipPlans?.content.map((membershipPlan: MembershipPlan) => {
        return <MembershipPlanListDetails key={membershipPlan.uuid} lang={lang} membershipPlan={membershipPlan}></MembershipPlanListDetails>
      })}
      
    </div>
  );
}
