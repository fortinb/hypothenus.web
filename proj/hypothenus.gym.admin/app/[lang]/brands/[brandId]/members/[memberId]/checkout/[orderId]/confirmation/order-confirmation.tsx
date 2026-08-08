"use client";

import { formatDate } from "@/app/lib/utils/dateUtils";
import AddressDisplay from "@/app/ui/components/contact/address-display";
import PhoneNumberDisplay from "@/app/ui/components/contact/phone-number-display";
import { OrderInfo } from "@/app/ui/components/order/order-info";
import { Brand } from "@/src/lib/entities/brand";
import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";
import { Order } from "@/src/lib/entities/sale/order";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function OrderConfirmation({ lang, brandId, order, brand }:
    {
        lang: string;
        brandId: string;
        order: Order;
        brand: Brand;
    }) {
    const t = useTranslations("checkout");

    return (
        <>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>
                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="d-flex flex-row justify-content-center">
                        <h2 className="text-secondary pt-4 ps-2">{t("confirmation.title")}
                            <i className="icon icon-secondary bi-cart-check m-1"></i>
                        </h2>
                    </div>
                    <hr />
                    <div>
                        <Row className="gx-2">
                            <Col xs={2} ></Col>
                            <Col xs={4} >
                                <div className="d-flex flex-column justify-content-center">
                                    <div className="d-flex flex-row justify-content-start">
                                        <span className="text-secondary">{order.billingDetail?.name}</span>
                                    </div>

                                    <div className="d-flex flex-row justify-content-start">
                                        {order.billingDetail?.address &&
                                            <AddressDisplay align="start" address={order.billingDetail?.address}></AddressDisplay>}
                                    </div>
                                    <div className="d-flex flex-row justify-content-start">
                                        <span className="text-primary">{order.billingDetail?.email}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={4} >
                                <div className="d-flex flex-column justify-content-start align-items-end">
                                    <div>
                                        <span className="text-secondary ">{brand.name}</span>
                                    </div>
                                    <div >
                                        {brand.address &&
                                            <AddressDisplay align="end" address={brand.address}></AddressDisplay>}
                                    </div>
                                    <div >
                                        <PhoneNumberDisplay phoneNumber={brand.phoneNumbers.find(p => p.type == PhoneNumberTypeEnum.business)}></PhoneNumberDisplay>
                                    </div>


                                </div>
                            </Col>
                            <Col xs={2} ></Col>
                        </Row>
                        <hr />
                        <Row className="gx-2">
                            <Col xs={2} ></Col>
                            <Col xs={4} >
                                <div className="d-flex flex-column justify-content-start">
                                    <span className="text-primary">{order.orderNumber}</span>
                                </div>
                            </Col>
                            <Col xs={4} >
                                <div className="d-flex flex-column justify-content-start align-items-end">
                                    <span className="text-primary">{formatDate(order.submittedOn)}</span>
                                </div>
                            </Col>
                            <Col xs={2} ></Col>
                        </Row>
                    </div>
                    <hr />
                    <div className="d-flex flex-column justify-content-start align-items-center w-100 h-100">
                        <Row className="gx-2 w-100">
                            <Col xs={2} ></Col>
                            <Col xs={8}>
                                <OrderInfo lang={lang} brandId={brandId} order={order} />
                            </Col>
                            <Col xs={2} ></Col>
                        </Row>
                        <Row className="gx-2 w-100">
                            <div className="d-flex flex-row justify-content-start align-items-center w-100">
                                <Col xs={2} ></Col>
                                <Col xs={8}>
                                    <div className="d-flex flex-row justify-content-center align-items-center w-100">
                                        <Button
                                            as={Link as any}
                                            href={`/${lang}/brands/${brandId}/memberships`}
                                            className="btn btn-primary mt-3">
                                            {t("confirmation.viewMemberships")}
                                            <i className="icon bi bi-person-check ms-2"></i>
                                        </Button>
                                    </div>
                                </Col>
                                <Col xs={2} ></Col>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}
