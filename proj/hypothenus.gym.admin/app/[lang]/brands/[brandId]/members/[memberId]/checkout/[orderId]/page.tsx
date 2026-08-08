

import { failure } from "@/app/lib/http/handle-result";
import { fetchFinancialInstrument } from "@/app/lib/services/financial-instrument-data-service";
import { getMember } from "@/app/lib/services/members-data-service";
import { getOrder } from "@/app/lib/services/order-data-service";
import { FinancialInstrument, formatExpirationDate } from "@/src/lib/entities/finance/financial-instrument";
import { Member } from "@/src/lib/entities/member";
import { Page } from "@/src/lib/entities/paging/page";
import { Order } from "@/src/lib/entities/sale/order";
import { FinancialInstrumentSelectedItem } from "@/src/lib/entities/ui/financial-instrument-selected-item";
import { auth } from "@/src/security/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./checkout-form";
import CheckoutOrder from "./checkout-order";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; memberId: string; orderId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { lang, brandId, memberId, orderId } = await params;

  const session = await auth();

  if (!session) {
    redirect("/public/signin");
  }

  const t = await getTranslations({
    locale: lang,
    namespace: "payment"
  });

  let member: Member;
  let order: Order;
  let financialInstruments: Page<FinancialInstrument>;

  try {

    [order, member, financialInstruments] = await Promise.all([
      getOrder(brandId, memberId, orderId),
      getMember(brandId, memberId),
      fetchFinancialInstrument(brandId, memberId, 0, 100)
    ]);

    if (!order) {
      redirect(`/${lang}/brands/${brandId}/memberships`);
    }

    if (!member) {
      redirect("/public/signin");
    }

    if (financialInstruments.content.length > 0) {
      member.financialInstruments = financialInstruments.content;
    }

  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  const availableFinancialInstrumentItems: FinancialInstrumentSelectedItem[] = financialInstruments.content.map((fi: FinancialInstrument) => {
    return {
      financialInstrument: fi,
      label: t("creditcard.selection", { cardNumber: fi.creditCard?.cardNumber ?? "", expirationDate: formatExpirationDate(fi.creditCard?.expirationDate ?? "") }),
      value: fi.uuid,
    } as FinancialInstrumentSelectedItem;
  });
  
  const initialFinancialInstrumentItems = availableFinancialInstrumentItems
    .sort((a, b) => a.label.localeCompare(b.label));

  let preferredFinancialInstrumentUuid = member.preferredFinancialInstrumentUuid;

  if (!member.preferredFinancialInstrumentUuid && member.financialInstruments.length > 0) {
    preferredFinancialInstrumentUuid = member.financialInstruments[0].uuid;
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
     
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <div className="overflow-auto flex-fill w-100 h-100">
          <CheckoutForm lang={lang} brandId={brandId} preparedOrder={order} member={member}
                        initialAvailableFinancialInstrumentItems={initialFinancialInstrumentItems} 
                        preferredFinancialInstrumentUuid={preferredFinancialInstrumentUuid} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CheckoutOrder lang={lang} brandId={brandId} order={order} />
      </div>
    </div>
  );
}
