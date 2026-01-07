import CoachsListPaging from "./coachs-list-paging";
import CoachsMenu from "./coachs-menu";
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';

interface PageProps {
    params: Promise<{ lang: string; brandId: string, gymId: string }>; 
}

export default async function Coachs({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "coachs.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}/coachs`,
          key: "breadcrumb",
          namespace: "coach"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <CoachsMenu lang={lang} brandId={brandId} gymId={gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachsListPaging lang={lang} brandId={brandId} gymId={gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}

