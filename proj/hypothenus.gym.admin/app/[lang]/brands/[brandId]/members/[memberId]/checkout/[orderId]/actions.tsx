"use server"

import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { postFinancialInstrument } from '@/app/lib/services/financial-instrument-data-service';
import { postOrder, submitOrder } from '@/app/lib/services/order-data-service';
import { FinancialInstrument } from '@/src/lib/entities/finance/financial-instrument';
import { Order } from '@/src/lib/entities/sale/order';
import { revalidatePath } from 'next/cache';

export async function submitOrderAction(data: Order): Promise<ActionResult<Order>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist
    let result: Order = await submitOrder(data.brandUuid, data.memberUuid, data.uuid, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createFinancialInstrumentAction(data: FinancialInstrument, path: string): Promise<ActionResult<FinancialInstrument>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.memberUuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });

  try {
    // 2. Persist
    let result: FinancialInstrument = await postFinancialInstrument(data.brandUuid, data.memberUuid, data);
    
    // 3. Revalidate cached pages
    revalidatePath(path);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}