"use client";

import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { ActionResult } from "@/app/lib/http/result";
import { Cart } from "@/src/lib/entities/cart/cart";
import { Order } from "@/src/lib/entities/financial/order";
import { useTranslations } from "next-intl";
import { CartItemRow } from "./cart-item-row";

export function CartInfo({ lang, isEditMode, cart }:
    {
        lang: string;
        isEditMode: boolean;
        cart: Cart;
    }) {
    const t = useTranslations("cart");

    const { removeFromCart, updateQuantity } = useOrderActions({
        actions: {
            submitOrder: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
            createOrder: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
        }
    });

    const subtotalAmount = cart.items?.reduce((total, item) => total + (item.membershipPlan.cost.amount / 100) * item.quantity, 0) ?? 0;
    const subtotalSymbol = cart.items[0]?.membershipPlan.cost.currency?.symbol ?? "";

    return (
        <div className="d-flex flex-column w-100 h-100">
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
                            <CartItemRow key={item.membershipPlan.uuid} item={item} lang={lang} isEditMode={isEditMode}
                                onRemove={removeFromCart}
                                onUpdateQuantity={updateQuantity}
                            />
                        ))}
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center px-2 pt-3">
                        <span className="">{t("subtotal")}</span>
                        <span className="">
                            {subtotalAmount.toFixed(2)}{subtotalSymbol}
                        </span>
                    </div>
                    <div className="d-flex flex-row justify-content-end px-2 pt-1">
                        <span className="">
                            {t("itemCount", { count: cart.items.length })}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
