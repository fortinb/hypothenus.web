import { failure } from "@/app/lib/http/handle-result";
import { fetchActiveMembershipPlans } from "@/app/lib/services/membership-plans-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Page } from "@/src/lib/entities/page";
import moment from "moment";
import { redirect } from "next/navigation";
import { Gym } from "@/src/lib/entities/gym";
import { fetchGyms } from "@/app/lib/services/gyms-data-service";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import MembershipMenu from "./membership-menu";
import MembershipPlansList from "./membership-plans-list";
import { auth } from "@/src/security/auth";
import { getMemberByUserIdpId } from "@/app/lib/services/members-data-service";
import { Member } from "@/src/lib/entities/member";
import MembershipCart from "./membership-cart";

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

export default async function MembershipsPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  const session = await auth();
   
  let pageOfMembershipPlan: Page<MembershipPlan>;
  let pageOfGyms: Page<Gym>;
  let member: Member | null = null;

  try {
    if (session) {
     [pageOfMembershipPlan, pageOfGyms, member] = await Promise.all([
      fetchActiveMembershipPlans(brandId, moment().toDate(), 0, 1000),
      fetchGyms(brandId, 0, 1000, false),
      getMemberByUserIdpId(brandId, session.user.id ?? "")
    ]);
    } else {
    [pageOfMembershipPlan, pageOfGyms] = await Promise.all([
      fetchActiveMembershipPlans(brandId, moment().toDate(), 0, 1000),
      fetchGyms(brandId, 0, 1000, false)
    ]);
    }

  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  let gyms: Gym[] = pageOfGyms.content;
  const availableGymItems: GymListItem[] = gyms?.map((gym: Gym) => {
    return {
      gym: gym,
      label: gym.name,
      value: gym.uuid,
    } as GymListItem;
  });

  let membershipPlans: MembershipPlan[] = pageOfMembershipPlan.content;
  membershipPlans.sort((a, b) => {
    const orderA = membershipPlanOrder[a.period] ?? 999;
    const orderB = membershipPlanOrder[b.period] ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.numberOfClasses - b.numberOfClasses;
  });

  const preferredGymUuid = member?.preferredGymUuid ?? (availableGymItems.length > 0 ? availableGymItems[0].gym.uuid : null);

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: true,
          id: "memberships.page",
          locale: `${lang}`,
          href: `/members/${brandId}/memberships`,
          key: "breadcrumb.memberships",
          namespace: "member"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <MembershipMenu lang={lang} initialAvailableGymItems={availableGymItems} preferredGymUuid={preferredGymUuid} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
          <MembershipPlansList lang={lang} membershipPlans={membershipPlans} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        {member && <MembershipCart brandId={brandId} lang={lang} member={member} />}
      </div>
    </div>
  );
}