
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function PaymentsPage({ params }: PageProps) {
  const { lang, brandId } = await params;


  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "payments.page",
          locale: `${lang}`,
          href: `/${lang}/members/${brandId}/payments`,
          key: "breadcrumb.payments",
          namespace: "member"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}