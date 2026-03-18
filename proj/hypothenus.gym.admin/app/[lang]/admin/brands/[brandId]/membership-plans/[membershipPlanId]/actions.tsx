"use server"

import { delMembershipPlan, postActivateMembershipPlan, postMembershipPlan, postDeactivateMembershipPlan, putMembershipPlan } from '@/app/lib/services/membership-plans-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { MembershipPlan } from '@/src/lib/entities/membership-plan';
import { revalidatePath } from 'next/cache';

export async function saveMembershipPlanAction(data: MembershipPlan, path: string): Promise<ActionResult<MembershipPlan>> {
  // 1. Validation (server-side)
  if (!data.brandUuid || !data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid and MembershipPlanUuid are required' });

  try {
    // 2. Persist 
    let result: MembershipPlan = await putMembershipPlan(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createMembershipPlanAction(data: MembershipPlan): Promise<ActionResult<MembershipPlan>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist
    let result: MembershipPlan = await postMembershipPlan(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateMembershipPlanAction(data: MembershipPlan, path: string): Promise<ActionResult<MembershipPlan>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MembershipPlanUuid is required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: MembershipPlan = await postActivateMembershipPlan(data.brandUuid, data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateMembershipPlanAction(data: MembershipPlan, path: string): Promise<ActionResult<MembershipPlan>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MembershipPlanUuid is required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: MembershipPlan = await postDeactivateMembershipPlan(data.brandUuid, data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteMembershipPlanAction(data: MembershipPlan): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MembershipPlanUuid is required' });

  try {
    // 2. Persist (DB, API, etc.)
    await delMembershipPlan(data.brandUuid, data.uuid);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
