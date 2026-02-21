import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import MembersListPaging from "./members-list-paging";
import MembersMenu from "./members-menu";
import { auth } from '@/src/security/auth';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>; 
}

export default async function MembersPage({ params }: PageProps) {
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
          id: "members.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/members`,
          key: "breadcrumb.members",
          namespace: "member"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <MembersMenu lang={lang}  />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <MembersListPaging lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}