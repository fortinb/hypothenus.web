
import { getTranslations } from 'next-intl/server';
import CoursesListPaging from "./courses-list-paging";
import CoursesMenu from "./courses-menu";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: { lang: string, brandId: string, gymId: string };
}

export default async function Courses({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "course" });

  return (
    <div>
      <Breadcrumb
        crumb={{
          reset: false,
          id: "courses.page",
          href: `/${params.lang}/brands/${params.brandId}/gyms/${params.gymId}/courses`,
          crumb: t("breadcrumb")
        }}
      />

      <div className="d-flex justify-content-between w-100 h-100">
        <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
          <CoursesMenu brandId={params.brandId} gymId={params.gymId} />
        </div>
        <div className="d-flex flex-column justify-content-between w-50 h-100">
          <CoursesListPaging brandId={params.brandId} gymId={params.gymId} />
        </div>
        <div className="d-flex flex-column justify-content-between w-25 h-100">

        </div>
      </div>
    </div>
  );
}

