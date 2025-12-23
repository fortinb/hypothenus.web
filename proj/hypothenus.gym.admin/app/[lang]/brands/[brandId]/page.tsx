import { Brand, newBrand } from "@/src/lib/entities/brand";
import BrandForm from "./brand-form";
import BrandMenu from "./brand-menu";
import BrandResume from "./brand-resume";
import { getBrand } from "@/app/lib/data/brands-data-service";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: { lang: string, brandId: string };
}

export default async function BrandPage({ params }: PageProps) {
  const t = await getTranslations({ locale: params.lang, namespace: "entity" });
  let brand: Brand;

  if (params.brandId === "new") {
    brand = newBrand();
  } else {
    brand = await getBrand(params.brandId);
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "brand.[brandId].page",
          href: `/${params.lang}/brands/${params.brandId}`,
          crumb: brand.name
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandMenu lang={params.lang} brandId={params.brandId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandForm lang={params.lang} brandId={params.brandId} brand={brand} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandResume />
      </div>
    </div>

  );
}
