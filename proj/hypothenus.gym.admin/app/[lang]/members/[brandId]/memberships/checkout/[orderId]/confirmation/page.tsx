

import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { auth } from "@/src/security/auth";
import { redirect } from "next/navigation";
import { OrderConfirmation } from "./order-confirmation";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function CheckoutConfirmationPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  const session = await auth();

  if (!session) {
    redirect("/public/signin");
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">

      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
        {/*  <CheckoutConfirmation lang={lang} brandId={brandId} order={cart.order as Order} /> */}
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">

      </div>
    </div>
  );
}

/*<Breadcrumb
        crumb={{
          reset: true,
          id: "checkout.page",
          locale: `${lang}`,
          href: `/members/${brandId}/memberships/checkout`,
          key: "breadcrumb.checkout",
          namespace: "member"
        }}
      />*/