"use client"

import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { ActionResult } from "@/app/lib/http/result";
import { CartState, clearCart, setBuyNow} from "@/app/lib/store/slices/cart-state-slice";
import MembershipPlanCardInfo from "@/app/ui/components/membership-plan/membership-plan-card-info";
import { LocaleTranslator } from "@/i18n/create-translators";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Order } from "@/src/lib/entities/sale/order";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAction, updateOrderItemsAction } from "./actions";

export default function MembershipPlanCard({ membershipPlan, brandId, tLocale, lang }: {
    membershipPlan: MembershipPlan;
    brandId: string;
    tLocale: LocaleTranslator["t"];
    lang: string;
}) {
    const dispatch = useDispatch();

    const cartState: CartState = useSelector((state: any) => state.cartState);
    const [onlyDisplay, setOnlyDisplay] = useState<boolean>(cartState.isCheckingOut);

    const { addToCart: addToCartAction, isSubmitting, createOrderFromCart, saveOrderFromCart } = useOrderActions({
        actions: {
            submit: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
            create: createOrderAction,
            patch: updateOrderItemsAction
        }
    });

    useEffect(() => {
        setOnlyDisplay(cartState.isCheckingOut);
    }, [cartState.isCheckingOut]);

    async function onMembershipPlanAction(addToCart: boolean, buyNow: boolean, membershipPlan: MembershipPlan) {
        if (buyNow && membershipPlan) {
            dispatch(clearCart());
            addToCartAction(membershipPlan);
            dispatch(setBuyNow(true));
        }

        if ((addToCart) && membershipPlan) {
            addToCartAction(membershipPlan);
        }
    }

    return (
        <MembershipPlanCardInfo
            membershipPlan={membershipPlan}
            lang={lang}
            tLocale={tLocale}
            onMembershipPlanAction={onMembershipPlanAction}
            onlyDisplay={onlyDisplay}
            linkActive={false}
            linkUri=""
        />
    );
}
