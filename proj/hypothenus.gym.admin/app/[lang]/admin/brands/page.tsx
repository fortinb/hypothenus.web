import BrandsMenu from "./brands-menu";
import BrandsListPaging from "./brands-list-paging";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string }>; // params is now a Promise
}

export default async function BrandsPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "brands.page",
          locale: `${lang}`,
          href: "/admin/brands",
          key: "breadcrumb",
          namespace: "brand"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <BrandsMenu lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandsListPaging lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">
      </div>
    </div>
  );
}