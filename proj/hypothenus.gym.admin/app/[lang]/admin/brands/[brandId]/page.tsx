import { Brand, newBrand } from "@/src/lib/entities/brand";
import BrandForm from "./brand-form";
import BrandMenu from "./brand-menu";
import BrandResume from "./brand-resume";
import { getBrand } from "@/app/lib/services/brands-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { hasAuthorization } from "@/app/lib/security/roles";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function BrandPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }

  if (!hasAuthorization(session.user.roles, ["admin"])) {
    redirect("/error");
  }

  let brand: Brand;

  try {
    if (brandId === "new") {
      brand = newBrand();
    } else {
      brand = await getBrand(brandId);
    }
  } catch (error) {
    console.error("Error fetching brand:", error);
    return redirect(`/${lang}/error`);
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
        <BrandMenu lang={lang} brand={brand} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandForm lang={lang} brand={brand} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandResume />
      </div>
    </div>
  );
}
