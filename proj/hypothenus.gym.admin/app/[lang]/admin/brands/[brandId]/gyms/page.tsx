import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import GymsListPaging from "./gyms-list-paging";
import GymsMenu from "./gyms-menu";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>; 
}

export default async function GymsPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "gyms.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms`,
          key: "breadcrumb",
          namespace: "gym"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <GymsMenu lang={lang} brandId={brandId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymsListPaging lang={lang} brandId={brandId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}