

import { auth } from "@/src/security/auth";
import { redirect } from "next/navigation";
import { OrderConfirmation } from "./order-confirmation";
import { Order } from "@/src/lib/entities/sale/order";
import { Brand } from "@/src/lib/entities/brand";
import { getOrder } from "@/app/lib/services/order-data-service";
import { getBrand } from "@/app/lib/services/brands-data-service";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; memberId: string; orderId: string }>;
}

export default async function CheckoutConfirmationPage({ params }: PageProps) {
  const { lang, brandId, memberId, orderId } = await params;

  const session = await auth();

  if (!session) {
    redirect("/public/signin");
  }

  let order: Order;
  let brand: Brand;

    [order, brand] = await Promise.all([
        getOrder(brandId, memberId, orderId),
        getBrand(brandId)
      ]);

  if (!order) {
      redirect(`/${lang}/brands/${brandId}/memberships`);
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">

      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
         <OrderConfirmation lang={lang} brandId={brandId} order={order} brand={brand} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">

      </div>
    </div>
  );
}