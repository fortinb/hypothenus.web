import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import GymsListPaging from "./gyms-list-paging";
import GymsMenu from "./gyms-menu";

interface PageProps {
  params: { lang: string, brandId: string };
}

export default async function GymsPage({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "gym" });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "gyms.page",
          href: `/${params.lang}/brands/${params.brandId}/gyms`,
          crumb: t("breadcrumb")
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <GymsMenu lang={params.lang} brandId={params.brandId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymsListPaging lang={params.lang} brandId={params.brandId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}