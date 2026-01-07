import { Brand, newBrand } from "@/src/lib/entities/brand";
import BrandForm from "./brand-form";
import BrandMenu from "./brand-menu";
import BrandResume from "./brand-resume";
import { getBrand } from "@/app/lib/services/brands-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>; 
}

export default async function BrandPage({ params }: PageProps) {
  const { lang, brandId } = await params; 

  let brand: Brand;

  if (brandId === "new") {  
    brand = newBrand();
  } else {
    brand = await getBrand(brandId);  
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "brand.[brandId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}`,  
          key: "",
          value: brand.name,
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandMenu lang={lang} brandId={brandId} />  
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandForm lang={lang} brandId={brandId} brand={brand} />  
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandResume />
      </div>
    </div>
  );
}
