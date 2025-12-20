import { getTranslations } from 'next-intl/server';
import CoachsListPaging from "./coachs-list-paging";
import CoachsMenu from "./coachs-menu";
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';

interface PageProps {
  params: { lang: string, brandId: string, gymId: string };
}

export default async function Coachs({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "coach" });

  return (
    <div>
      <Breadcrumb
        crumb={{
          reset: false,
           id: "coachs.page",
          href: `/${params.lang}/brands/${params.brandId}/gyms/${params.gymId}/coachs`,
          crumb: t("breadcrumb")
        }}
      />
      <div className="d-flex justify-content-between w-100 h-100">
        <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
          <CoachsMenu brandId={params.brandId} gymId={params.gymId} />
        </div>
        <div className="d-flex flex-column justify-content-between w-50 h-100">
          <CoachsListPaging brandId={params.brandId} gymId={params.gymId} />
        </div>
        <div className="d-flex flex-column justify-content-between w-25 h-100">

        </div>
      </div>
    </div>
  );
}

