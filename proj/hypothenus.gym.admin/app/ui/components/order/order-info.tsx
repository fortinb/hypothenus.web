"use client";

import { formatDate } from "@/app/lib/utils/dateUtils";
import { Order } from "@/src/lib/entities/financial/order";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { getMembershipPlanName } from "@/src/lib/entities/membership-plan";
import { useTranslations } from "next-intl";


export function OrderInfo({ lang, brandId, order }:
    {
        lang: string;
        brandId: string;
        order: Order;
    }) {
    const t = useTranslations("entity");

    if (!order) {
        return <></>;
    }

    return (
        <div className="d-flex flex-column align-items-center text-center py-4">
            <div className="d-flex flex-column w-100 h-100">
                <div className="d-flex flex-row justify-content-center">
                    <h2 className="text-secondary pt-4 ps-2">
                        {t("panel.title")}
                        <i className="icon icon-secondary bi-cart3 m-1"></i>
                    </h2>
                </div>
                <div className="ps-2 pe-2">
                    <hr />
                </div>

                <div className="d-flex flex-column px-2">
                    {order.items.map((item) => (
                        <div key={item.membershipPlan.uuid} className="d-flex flex-row justify-content-between align-items-center py-2">
                            <div className="d-flex flex-column">
                                <span className="text-primary">{getMembershipPlanName(item.membershipPlan, lang as LanguageEnum)}</span>
                            </div>
                        </div>

                    ))}
                </div>

                <div className="d-flex flex-row justify-content-between align-items-center px-2 pt-3">
                    <span className="">{t("panel.subtotal")}</span>
                    <span className="">
                        {order.subTotal.amount.toFixed(2)}{order.subTotal.currency.symbol} ({order.subTotal.currency.code})
                    </span>
                </div>
                <div className="d-flex flex-row justify-content-end px-2 pt-1">
                    <span className="">
                        {t("panel.itemCount", { count: order.items.length })}
                    </span>
                </div>
            </div>

        </div>
    );
}
