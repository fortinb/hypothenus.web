
import { getTranslations } from 'next-intl/server';
import CoursesListPaging from "./courses-list-paging";
import CoursesMenu from "./courses-menu";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: { lang: string, brandId: string, gymId: string };
}

export default async function CoursesPage({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "course" });

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "courses.page",
          href: `/${params.lang}/brands/${params.brandId}/gyms/${params.gymId}/courses`,
          crumb: t("breadcrumb")
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <CoursesMenu lang={params.lang} brandId={params.brandId} gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoursesListPaging lang={params.lang} brandId={params.brandId} gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}

