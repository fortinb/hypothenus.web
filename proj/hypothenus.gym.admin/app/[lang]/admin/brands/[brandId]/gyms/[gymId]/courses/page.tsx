
import CoursesListPaging from "./courses-list-paging";
import CoursesMenu from "./courses-menu";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string; brandId: string, gymId: string }>;
}

export default async function CoursesPage({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "courses.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}/courses`,
          key: "breadcrumb",
          namespace: "course"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <CoursesMenu lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoursesListPaging lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}

