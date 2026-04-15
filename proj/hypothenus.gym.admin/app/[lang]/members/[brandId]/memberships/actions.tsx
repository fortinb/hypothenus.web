"use server"

import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { postOrder } from '@/app/lib/services/order-data-service';
import { Cart } from '@/src/lib/entities/cart/cart';
import { Order } from '@/src/lib/entities/cart/order';

export async function createOrderAction(cart: Cart): Promise<ActionResult<Order>> {
  // 1. Validation (server-side)
  if (!cart.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist
    let result: Order = await postOrder(cart.brandUuid, cart);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}