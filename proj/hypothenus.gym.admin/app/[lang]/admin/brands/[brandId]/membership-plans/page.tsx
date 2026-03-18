import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import MembershipPlansListPaging from "./membership-plans-list-paging";
import MembershipPlansMenu from "./membership-plans-menu";
import { auth } from '@/src/security/auth';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>; 
}

export default async function MembershipPlansPage({ params }: PageProps) {
  const { lang, brandId } = await params;
  
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  
  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "membershipPlans.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/membership-plans`,
          key: "breadcrumb.membershipPlans",
          namespace: "membership-plan"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <MembershipPlansMenu lang={lang}  />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <MembershipPlansListPaging lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}
