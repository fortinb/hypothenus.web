import BrandsMenu from "./brands-menu";
import BrandsListPaging from "./brands-list-paging";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function Brands({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "brand" });

  return (
    <div>
      <Breadcrumb
        crumb={{
          reset: false,
          id: "brands.page",
          href: `/${params.lang}/brands`,
          crumb: t("breadcrumb")
        }}
      />

      <div className="d-flex justify-content-between w-100 h-100">
        <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
          <BrandsMenu />
        </div>
        <div className="d-flex flex-column justify-content-between w-50 h-100">
          <BrandsListPaging />
        </div>
        <div className="d-flex flex-column justify-content-between w-25 h-100">
        </div>
      </div>
    </div>
  );
}