"use client";

import {
    addToCart as addToCartState,
    clearCart,
    removeFromCart as removeFromCartState,
    updateQuantity as updateQuantityState,
} from "@/app/lib/store/slices/cart-state-slice";
import { Order } from "@/src/lib/entities/financial/order";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTransition } from "react";
import { ActionResult } from "../http/result";
import { debugLog } from "../utils/debug";
import { useAppDispatch } from "./useStore";
import { Cart, CartItem } from "@/src/lib/entities/cart/cart";

interface OrderActions<Order> {
    createOrder: (...args: any[]) => Promise<ActionResult<Order>>;
    submitOrder: (...args: any[]) => Promise<ActionResult<Order>>;
}

interface UseOrderActionsParams<Order> {
    actions: OrderActions<Order>;
}

export function useOrderActions({ actions }: UseOrderActionsParams<Order>) {
    const dispatch = useAppDispatch();
    const [isSubmitting, startSubmit] = useTransition();
    const [isSaving, startSave] = useTransition();

    const addToCart = (membershipPlan: MembershipPlan) => {
        const item: CartItem = {
            membershipPlan: membershipPlan,
            quantity: 1,
            addedAt: new Date().toISOString(),
        };
        dispatch(addToCartState(item));
    };

    const removeFromCart = (membershipPlanUuid: string) => {
        dispatch(removeFromCartState({ membershipPlanUuid }));
    };

    const updateQuantity = (membershipPlanUuid: string, quantity: number) => {
        dispatch(updateQuantityState({ membershipPlanUuid, quantity }));
    };

    const submitOrder = (entity: Order, beforeSubmit?: (entity: Order) => void, onSuccess?: (entity: Order) => void, onError?: (result: ActionResult<Order>) => void) => {
        startSubmit(async () => {
            beforeSubmit?.(entity);

            const result = await actions.submitOrder(entity);

            if (!result.ok) {
                debugLog('submitOrder error', result);
                onError?.(result);
                return;
            }

            onSuccess?.(result.data);
        });
    };

    const createOrderFromCart = (entity: Cart, beforeSubmit?: (entity: Cart) => void, onSuccess?: (entity: Order) => void, onError?: (result: ActionResult<Order>) => void) => {
        startSave(async () => {
            beforeSubmit?.(entity);

            const result = await actions.createOrder(entity);

            if (!result.ok) {
                debugLog('createOrder error', result);
                onError?.(result);
                return;
            }

            dispatch(clearCart());
            onSuccess?.(result.data);
        });
    };

    return {
        isSubmitting,
        addToCart,
        removeFromCart,
        updateQuantity,
        createOrderFromCart,
        submitOrder
    };
}
