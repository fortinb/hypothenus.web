"use client";

import { Order } from "@/src/lib/entities/sale/order";
import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { OrderItemRow } from "./order-item-row";
import { formatCost } from "@/src/lib/entities/finance/cost";
import { getTaxCode, getTaxName } from "@/src/lib/entities/finance/tax";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";

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
        <div className="d-flex flex-column align-items-center py-4">
            <div className="d-flex flex-column w-100 h-100">
                <div className="d-flex flex-column px-2">
                    <Row className="gx-2 py-2">
                        <Col xs={4} className="d-flex justify-content-start">
                            <span className="text-secondary-dark">{t("order.header.product")}</span>
                        </Col>
                        <Col xs={2} className="d-flex justify-content-center">
                            <span className="text-secondary-dark">{t("order.header.unitPrice")}</span>
                        </Col>
                        <Col xs={3}>
                        </Col>
                        <Col xs={1} className="d-flex justify-content-center">
                            <span className="text-secondary-dark">{t("order.header.quantity")}</span>
                        </Col>
                        <Col xs={2} className="d-flex justify-content-center">
                            <span className="text-secondary-dark">{t("order.header.total")}</span>
                        </Col>
                    </Row>
                    {order.items.map((item, index) => (
                        <OrderItemRow key={index} item={item} lang={lang}
                        />
                    ))}
                </div>
                <hr className="mt-1 mb-1" />
                <div className="d-flex flex-column px-2">
                    <Row className="gx-2 py-2">
                        <Col xs={9} className="d-flex align-items-center">
                            <span className="text-primary">{t("order.label.subtotal")} </span>
                            <span className="card-text-smaller text-primary ms-2">( {t("order.label.itemCount", { count: order.items.reduce((sum, item) => sum + item.quantity, 0) })} )</span>
                        </Col>
                        <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                            <span className="text-primary">{formatCost(order.subTotal, false)}  </span>
                        </Col>
                    </Row>
                    {order.shippingTotal && order.shippingTotal.amount > 0 && (
                    <Row className="">
                        <Col xs={9} className="d-flex align-items-center">
                            <span className="text-primary">{t("order.label.shipping")} </span>
                        </Col>
                        <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                            <span className="text-primary">{formatCost(order.shippingTotal?.amount, false)}  </span>
                        </Col>
                    </Row>
                    )}
                    {order.discountTotal && order.discountTotal.amount > 0 && (
                    <Row className="">
                        <Col xs={9} className="d-flex align-items-center">
                            <span className="text-primary">{t("order.label.discount")} </span>
                        </Col>
                        <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                            <span className="text-primary">{formatCost(order.discountTotal?.amount, false)}  </span>
                        </Col>
                    </Row>
                    )}
                    {order.taxes && order.taxes?.map((item, index) => (
                        <Row key={index} className="">
                            <Col xs={9} className="d-flex justify-content-start align-items-center">
                                <span className="text-primary">{getTaxName(item, lang as LanguageEnum)} ({getTaxCode(item, lang as LanguageEnum)}) </span>
                            </Col>
                            <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                                <span className="text-primary">{formatCost(item.taxAmount, false)}  </span>
                            </Col>
                        </Row>
                    ))}
                    <Row className="gx-2 py-2">
                        <Col xs={9} className="d-flex justify-content-start  align-items-center">
                            <span className="text-primary">{t("order.label.total")} </span>
                        </Col>
                        <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                            <span className="text-secondary-dark">{formatCost(order.total, false)}  </span>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}
