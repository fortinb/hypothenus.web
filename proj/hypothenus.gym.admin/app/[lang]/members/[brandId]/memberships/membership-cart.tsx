"use client"

import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { ActionResult } from "@/app/lib/http/result";
import { CartState, updateCartOwnership } from "@/app/lib/store/slices/cart-state-slice";
import FormActionCartButtons from "@/app/ui/components/actions/form-action-cart-buttons";
import { CartInfo } from "@/app/ui/components/cart/cart-info";
import { Cart } from "@/src/lib/entities/cart/cart";
import { Order } from "@/src/lib/entities/cart/order";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAction } from "./actions";
import { Member } from "@/src/lib/entities/member";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import ToastResult from "@/app/ui/components/notifications/toast-result";

export default function MembershipCart({ lang, brandId, member }:
    {
        lang: string;
        brandId: string;
        member: Member;
    }) {
    const t = useTranslations("cart");
    const router = useRouter();
    const cartState: CartState = useSelector((state: any) => state.cartState);
    const dispatch = useDispatch();

    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    const { createOrderFromCart } = useOrderActions({
        actions: {
            submitOrder: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
            createOrder: createOrderAction
        }
    });

    useEffect(() => {
        if (!cartState.cart.brandUuid || !cartState.cart.memberUuid) {
            dispatch(updateCartOwnership({ memberUuid: member.uuid, brandUuid: brandId }));
        }
    }, [brandId, member, dispatch]);

    function onCheckout(e: MouseEvent<HTMLButtonElement>) {
        setIsEditMode(false);

        createOrder(cartState.cart);
    }

    const createOrder = (cart: Cart) => {
        createOrderFromCart(
            cart,
            // Before save
            async (_) => {
            },
            // Success
            (order) => {
                // Redirect to checkout page with order details
                router.push(`/${lang}/members/${brandId}/memberships/checkout/${order.uuid}`);

            },
            // Error
            (result) => {
                showResultToast(false, t("action.createOrderError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    return (
        <div className="d-flex flex-column justify-content-start w-100 h-50">
            <div className="d-flex flex-column h-100">
                <Container fluid={true}>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-tertiary">{t("title")}</h1>
                    </div>
                    <hr className="mt-1" />
                    <CartInfo lang={lang} isEditMode={isEditMode} cart={cartState.cart} />
                    <hr className="mt-1 mb-1" />
                    <FormActionCartButtons onCheckout={onCheckout} />
                </Container>
            </div>
            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
        </div>
    );
}
