"use client"

import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { ActionResult } from "@/app/lib/http/result";
import { CartState, resetCart, setRedirectToCheckout, setCartCheckout, updateCartBrandOwnership, updateCartMemberOwnership, updateCartOrderUuid, setBuyNow } from "@/app/lib/store/slices/cart-state-slice";
import FormActionCartButtons from "@/app/ui/components/actions/form-action-cart-buttons";
import { CartInfo } from "@/app/ui/components/cart/cart-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Cart } from "@/src/lib/entities/cart/cart";
import { DOMAIN_EXCEPTION_TRIAL_MEMBERSHIP_PLAN_ONLY_FOR_NEW_MEMBER } from "@/src/lib/entities/entity/messages";
import { Member } from "@/src/lib/entities/member";
import { Order } from "@/src/lib/entities/sale/order";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAction, updateOrderItemsAction } from "./actions";

export default function MembershipCart({ lang, brandId, member }:
    {
        lang: string;
        brandId: string;
        member: Member | null;
    }) {
    const t = useTranslations("cart");
    const router = useRouter();
    const cartState: CartState = useSelector((state: any) => state.cartState);

    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const [isEditMode, setIsEditMode] = useState<boolean>(!cartState.redirectToCheckout);
    const [isClient, setIsClient] = useState<boolean>(false);

    const { isSaving, createOrderFromCart, saveOrderFromCart, removeFromCart, updateQuantity } = useOrderActions({
        actions: {
            submit: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
            create: createOrderAction,
            patch: updateOrderItemsAction
        }
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useEffect(() => {
        // SSR Hydration complete, now we can use client-side features
        if (isClient === false) {
            setIsClient(true);
        }
    }, [isClient]);

    useEffect(() => {
        // SSR Hydration complete, now we can use client-side features
        if (isClient === false) {
            setIsClient(true);
        }
    }, [isClient]);

  /*  
    useEffect(() => {
        if (cartState.isCheckingOut === true) {
            dispatch(setCartCheckout(false));
        }
    }, [cartState.isCheckingOut]);
*/

    useEffect(() => {
        if (cartState.buyNow) {
            onCheckout(null as any);
            dispatch(setBuyNow(false));
        }
    }, [cartState.buyNow]);

    useEffect(() => {
        if (member && cartState.cart.memberUuid && cartState.cart.memberUuid != member?.uuid) {
            dispatch(resetCart());
        }

        if (!member && cartState.cart.memberUuid) {
            dispatch(resetCart());
        }

        if (!cartState.cart.brandUuid) {
            dispatch(updateCartBrandOwnership(brandId));
        }

        if (member && !cartState.cart.memberUuid) {
            dispatch(updateCartMemberOwnership(member.uuid));
        }

        if (cartState.redirectToCheckout) {
            if (status === "loading") {
                // console.log("loading session");
                return; // Wait for session status to resolve
            }

            if (status === "unauthenticated") {
                //console.log("session is unauthenticated");
                dispatch(setRedirectToCheckout(false));
                setIsEditMode(true);
                return;
            }

            if (member && session && status === "authenticated") {
                // console.log("session clear to redirect");
                dispatch(setRedirectToCheckout(false));
                if (cartState.cart.orderUuid) {
                    updateOrderItems(brandId, member.uuid, cartState.cart);
                } else {
                    createOrder(brandId, member.uuid, cartState.cart);
                }
            }
        }

    }, [brandId, member, dispatch, session, status]);

    const renderedCart = isClient ? cartState.cart : null;

    async function onCheckout(e: MouseEvent<HTMLButtonElement>) {

        setIsEditMode(false);
        dispatch(setCartCheckout(true));

        if (!session || status !== "authenticated") {
            dispatch(setRedirectToCheckout(true));
            return await signIn("entra");
        }

        if (member) {
            // Order Already exists
            if (cartState.cart.orderUuid) {
                updateOrderItems(brandId, member.uuid, cartState.cart);
            } else {
                createOrder(brandId, member.uuid, cartState.cart);
            }
        }
    }

    const createOrder = (brandId: string, memberUuid: string, cart: Cart) => {
        createOrderFromCart(
            brandId,
            memberUuid,
            cart,
            // Before save
            async (_) => {
            },
            // Success
            (order) => {
                const trialError = order.messages?.find(m => m.code == DOMAIN_EXCEPTION_TRIAL_MEMBERSHIP_PLAN_ONLY_FOR_NEW_MEMBER)
                if (trialError) {
                    showResultToast(false, t("action.trialError"), undefined);
                    dispatch(setCartCheckout(false));
                    setIsEditMode(true);
                } else {
                    dispatch(updateCartOrderUuid(order.uuid));
                    router.push(`/${lang}/brands/${brandId}/members/${member?.uuid}/checkout/${order.uuid}`);
                }
            },
            // Error
            (result) => {
                setIsEditMode(true);
                showResultToast(false, t("action.createOrderError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const updateOrderItems = (brandId: string, memberUuid: string, cart: Cart) => {
        saveOrderFromCart(
            brandId,
            memberUuid,
            cart,
            `/${lang}/brands/${brandId}/members/${member?.uuid}/checkout/${cart.orderUuid}`,
            // Before save
            async (_) => {
            },
            // Success
            (order) => {
                const trialError = order.messages?.find(m => m.code == DOMAIN_EXCEPTION_TRIAL_MEMBERSHIP_PLAN_ONLY_FOR_NEW_MEMBER)
                if (trialError) {
                    showResultToast(false, t("action.trialError"), undefined);
                    setIsEditMode(true);
                } else {
                    dispatch(updateCartOrderUuid(order.uuid));
                    router.push(`/${lang}/brands/${brandId}/members/${member?.uuid}/checkout/${order.uuid}`);
                }
            },
            // Error
            (result) => {
                setIsEditMode(true);
                showResultToast(false, t("action.createOrderError"), !result.ok ? result.error?.message : undefined);
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
                    {renderedCart && (
                        <div>
                            <CartInfo lang={lang} cart={renderedCart} isEditMode={isEditMode}
                                onRemoveFromCart={removeFromCart}
                                onUpdateQuantity={updateQuantity} />
                            <hr className="mt-1 mb-1" />
                            <Row className="">
                                <Col xs={11} className="d-flex flex-column justify-content-center pt-2">
                                    <FormActionCartButtons onCheckout={onCheckout} hasItems={renderedCart.items.length > 0} isSaving={isSaving} isEditMode={isEditMode} />
                                </Col>
                                <Col xs={1}>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Container>
                <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
            </div>
        </div>
    );
}