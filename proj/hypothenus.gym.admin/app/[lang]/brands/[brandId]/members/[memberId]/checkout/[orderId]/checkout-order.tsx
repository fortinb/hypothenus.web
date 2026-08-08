"use client"

import { OrderInfo } from "@/app/ui/components/order/order-info";
import { Order } from "@/src/lib/entities/sale/order";
import { useTranslations } from "next-intl";
import Container from "react-bootstrap/Container";

export default function CheckoutOrder({ lang, brandId, order }:
    {
        lang: string;
        brandId: string;
        order: Order;
    }) {
    const t = useTranslations("order");

    return (
        <div className="d-flex flex-column justify-content-start w-100 h-50 mt-2">
            <div className="d-flex flex-column h-100">
                <Container fluid={true}>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-tertiary">{t("title")}</h1>
                    </div>
                    <hr className="mt-1" />
                    <OrderInfo lang={lang} brandId={brandId} order={order}/>
                    <hr className="mt-1 mb-1" />
                </Container>
            </div>
        </div>
    );
}