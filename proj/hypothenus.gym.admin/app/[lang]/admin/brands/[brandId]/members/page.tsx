import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import MembersListPaging from "./members-list-paging";
import MembersMenu from "./members-menu";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>; 
}

export default async function MembersPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "members.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/members`,
          key: "breadcrumb",
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