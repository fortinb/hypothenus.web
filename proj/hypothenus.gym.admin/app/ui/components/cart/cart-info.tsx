"use client";

import { Cart } from "@/src/lib/entities/cart/cart";
import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { CartItemRow } from "./cart-item-row";

export function CartInfo({ lang, cart, onRemoveFromCart, onUpdateQuantity, isEditMode }:
    {
        lang: string;
        cart: Cart;
        onRemoveFromCart: (membershipPlanUuid: string) => void;
        onUpdateQuantity: (membershipPlanUuid: string, quantity: number) => void;
        isEditMode: boolean;

    }) {
    const t = useTranslations("cart");

    const subtotalAmount = cart.items?.reduce((total, item) => total + (item.membershipPlan.price.amount / 100) * item.quantity, 0) ?? 0;
    const subtotalSymbol = cart.items[0]?.membershipPlan.price.currency?.symbol ?? "";

    return (
        <div className="d-flex flex-column w-100">
            {cart.items.length === 0 ? (
                <div className="d-flex flex-column align-items-center text-center py-4 text-muted">
                    <i className="bi bi-cart-x mb-3" ></i>
                    <p className="">{t("empty")}</p>
                    <p className="">{t("emptySubtitle")}</p>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-column px-2">
                        {cart.items.map((item) => (
                            <CartItemRow key={item.membershipPlan.uuid} item={item} lang={lang}
                                onRemove={onRemoveFromCart}
                                onUpdateQuantity={onUpdateQuantity}
                                isEditMode={isEditMode}
                            />
                        ))}
                    </div>
                    <hr className="mt-1 mb-1" />
                    <div className="d-flex flex-column px-2">
                        <Row className="gx-2 py-2">
                            <Col xs={5} className="d-flex justify-content-start">
                                <span className="text-primary">{t("subtotal")}</span>
                            </Col>
                            <Col xs={3} >
                            </Col>
                            <Col xs={3} className="d-flex flex-column align-items-end justify-content-center">
                                <span className="text-primary">
                                    {subtotalAmount.toFixed(2)}{subtotalSymbol}
                                </span>
                            </Col>
                            <Col xs={1}>
                            </Col>
                        </Row>
                        <Row className="">
                            <Col xs={11} className="d-flex flex-column justify-content-center">
                                <div className="d-flex flex-row justify-content-end">
                                    <span className="card-text-smaller">
                                        {t("itemCount", { count: cart.items.reduce((sum, item) => sum + item.quantity, 0) })}
                                    </span>
                                </div>
                            </Col>
                            <Col xs={1}>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </div>
    );
}