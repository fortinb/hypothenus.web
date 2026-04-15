"use client";

import { OrderInfo } from "@/app/ui/components/order/order-info";
import { Order } from "@/src/lib/entities/cart/order";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "react-bootstrap/Button";

export function OrderConfirmation({ lang, brandId, order }:
    {
        lang: string;
        brandId: string;
        order: Order;
    }) {
    const t = useTranslations("entity");

    return (
        <>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>
                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="d-flex flex-row justify-content-center">
                        <h2 className="text-secondary pt-4 ps-2">{t("confirmation.title")}
                            <i className="icon icon-secondary bi-person-gear m-1"></i>
                        </h2>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
                        <OrderInfo lang={lang} brandId={brandId} order={order} />
                    </div>
                    <Button
                        as={Link as any}
                        href={`/${lang}/members/${brandId}/payments`}
                        className="btn btn-primary mt-3"
                    >
                        {t("confirmation.viewMemberships")}
                        <i className="icon bi bi-person-check ms-2"></i>
                    </Button>
                </div>
            </div>
        </>
    );
}
