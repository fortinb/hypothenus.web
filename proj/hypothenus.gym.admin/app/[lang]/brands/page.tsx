import BrandsMenu from "./brands-menu";
import BrandsListPaging from "./brands-list-paging";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function BrandsPage({ params }: PageProps) {

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "brands.page",
          href: `/${params.lang}/brands`,
          key: "breadcrumb",
          namespace: "brand"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <BrandsMenu lang={params.lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandsListPaging lang={params.lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">
      </div>
    </div>

  );
}