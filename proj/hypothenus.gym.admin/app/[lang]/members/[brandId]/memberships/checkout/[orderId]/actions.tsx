"use server"

import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { submitOrder } from '@/app/lib/services/order-data-service';
import { Order } from '@/src/lib/entities/cart/order';

export async function submitOrderAction(data: Order): Promise<ActionResult<Order>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist
    let result: Order = await submitOrder(data.brandUuid, data.uuid, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}