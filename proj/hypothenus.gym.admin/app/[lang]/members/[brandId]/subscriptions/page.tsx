

import { failure } from "@/app/lib/http/handle-result";
import { fetchActiveMembershipPlans } from "@/app/lib/services/membership-plans-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Page } from "@/src/lib/entities/page";
import moment from "moment";
import { redirect } from "next/navigation";
import MembershipPlansList from "./membership-plans-list";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export const membershipPlanOrder: Record<MembershipPlanPeriodEnum, number> = {
  [MembershipPlanPeriodEnum.trial]: 1,
  [MembershipPlanPeriodEnum.classes]: 2,
  [MembershipPlanPeriodEnum.monthly]: 3,
  [MembershipPlanPeriodEnum.weekly]: 4,
  [MembershipPlanPeriodEnum.hours]: 5,
  [MembershipPlanPeriodEnum.amount]: 6,
  [MembershipPlanPeriodEnum.merchandise]: 7
};

export default async function SubscriptionsPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  let pageOfMembershipPlan: Page<MembershipPlan>;

  try {
    pageOfMembershipPlan = await fetchActiveMembershipPlans(brandId, moment().toDate(), 0, 1000);
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  let membershipPlans: MembershipPlan[] = pageOfMembershipPlan.content;

  membershipPlans.sort((a, b) => {
    const orderA = membershipPlanOrder[a.period] ?? 999;
    const orderB = membershipPlanOrder[b.period] ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.numberOfClasses - b.numberOfClasses;
  });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "subscriptions.page",
          locale: `${lang}`,
          href: `/${lang}/members/${brandId}/subscriptions`,
          key: "breadcrumb.subscriptions",
          namespace: "member"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
          <MembershipPlansList lang={lang} membershipPlans={membershipPlans} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}