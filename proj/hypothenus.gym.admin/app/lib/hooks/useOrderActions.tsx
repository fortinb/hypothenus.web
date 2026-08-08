"use client";

import {
    addToCart as addToCartState,
    clearCart,
    removeFromCart as removeFromCartState,
    updateQuantity as updateQuantityState,
} from "@/app/lib/store/slices/cart-state-slice";
import { mapCartToOrder, Order } from "@/src/lib/entities/sale/order";
import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { useTransition } from "react";
import { ActionResult } from "../http/result";
import { debugLog } from "../utils/debug";
import { useAppDispatch } from "./useStore";
import { Cart, CartItem } from "@/src/lib/entities/cart/cart";
import { OrderStatusEnum } from "@/src/lib/entities/enum/order-status-enum";

interface OrderActions<Order> {
    create: (...args: any[]) => Promise<ActionResult<Order>>;
    patch: (...args: any[]) => Promise<ActionResult<Order>>;
    submit: (...args: any[]) => Promise<ActionResult<Order>>;
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
            quantity: 1
        };
        dispatch(addToCartState(item));
    };

    const removeFromCart = (membershipPlanUuid: string) => {
        dispatch(removeFromCartState({ membershipPlanUuid }));
    };

    const updateQuantity = (membershipPlanUuid: string, quantity: number) => {
        dispatch(updateQuantityState({ membershipPlanUuid, quantity }));
    };

    const submitOrder = (entity: Order, entityPath?: string, beforeSubmit?: (entity: Order) => void, onSuccess?: (entity: Order) => void, onError?: (result: ActionResult<Order>) => void) => {
        startSubmit(async () => {
            beforeSubmit?.(entity);
            if (entity.status == OrderStatusEnum.completed || entity.status == OrderStatusEnum.cancelled) {
                debugLog('submitOrder error: Order status is completed or cancelled', entity);
                onError?.({ ok: false, error: { message: "Order status is completed or cancelled" } });
                return;
            }

            const result = await actions.submit(entity, entityPath);

            if (!result.ok) {
                debugLog('submitOrder error', result);
                onError?.(result);
                return;
            }

            dispatch(clearCart());
            onSuccess?.(result.data);
        });
    };

    const saveOrderFromCart = (brandId: string, memberUuid: string, entity: Cart, entityPath?: string, beforeSave?: (entity: Cart) => void, onSuccess?: (entity: Order) => void, onError?: (result: ActionResult<Order>) => void) => {
        startSave(async () => {
            beforeSave?.(entity);

            const order = mapCartToOrder(entity);
            order.brandUuid = brandId;
            order.memberUuid = memberUuid;

            const result = await actions.patch(order, entityPath);

            if (!result.ok) {
                debugLog('saveOrder error', result);
                onError?.(result);
                return;
            }

            onSuccess?.(result.data);
        });
    };

    const createOrderFromCart = (brandId: string, memberUuid: string, entity: Cart, beforeSave?: (entity: Cart) => void, onSuccess?: (entity: Order) => void, onError?: (result: ActionResult<Order>) => void) => {
        startSave(async () => {
            beforeSave?.(entity);

            // Create order entity from cart
            const order = mapCartToOrder(entity);
            order.brandUuid = brandId;
            order.memberUuid = memberUuid;

            const result = await actions.create(order);

            if (!result.ok) {
                debugLog('createOrder error', result);
                onError?.(result);
                return;
            }

            onSuccess?.(result.data);
        });
    };

    return {
        isSaving,
        isSubmitting,
        addToCart,
        removeFromCart,
        updateQuantity,
        createOrderFromCart,
        submitOrder,
        saveOrderFromCart
    };
}
