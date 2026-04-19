

import { auth } from "@/src/security/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./checkout-form";
import { BillingInfo } from "@/app/ui/components/order/billing-info";
import { Member } from "@/src/lib/entities/member";
import { getMemberByUserIdpId } from "@/app/lib/services/members-data-service";
import { failure } from "@/app/lib/http/handle-result";
import { Order } from "@/src/lib/entities/financial/order";
import { fetchCourses } from "@/app/lib/services/courses-data-service";
import { getOrder } from "@/app/lib/services/order-data-service";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; orderId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { lang, brandId, orderId } = await params;

  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/public/signin");
  }

  let member: Member;
  let order: Order;

  try {

    [member, order] = await Promise.all([
      getMemberByUserIdpId(brandId, session.user.id),
      getOrder(brandId, orderId)
    ]);
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }
  
  return (
    <div className="d-flex justify-content-between w-100 h-100">

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">

      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
          <CheckoutForm lang={lang} brandId={brandId} member={member} preparedOrder={order} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BillingInfo lang={lang} brandId={brandId} member={member} />
      </div>
    </div>
  );
}