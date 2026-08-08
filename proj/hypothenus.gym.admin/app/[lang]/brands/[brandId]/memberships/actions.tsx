"use server"

import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { postOrder, patchOrder } from '@/app/lib/services/order-data-service';
import { Order } from '@/src/lib/entities/sale/order';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(order: Order): Promise<ActionResult<Order>> {
  // 1. Validation (server-side)
  if (!order.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!order.memberUuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });  

  try {
    // 2. Persist
    let result: Order = await postOrder(order.brandUuid, order.memberUuid, order);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function updateOrderItemsAction(data: Order, path: string): Promise<ActionResult<Order>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.memberUuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'OrderUuid is required' });  

  try {
    // 2. Persist 
    let result: Order = await patchOrder(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}