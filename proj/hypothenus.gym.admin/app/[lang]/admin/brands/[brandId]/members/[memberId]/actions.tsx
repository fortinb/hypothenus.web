"use server"

import { delMember, postActivateMember, postMember, postDeactivateMember, putMember } from '@/app/lib/services/members-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { Member } from '@/src/lib/entities/member';
import { revalidatePath } from 'next/cache';

export async function saveMemberAction(data: Member, path: string): Promise<ActionResult<Member>> {
  // 1. Validation (server-side)
  if (!data.brandUuid || !data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid and MemberUuid are required' });

  try {
    // 2. Persist 
    let result: Member = await putMember(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createMemberAction(data: Member): Promise<ActionResult<Member>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist
    let result: Member = await postMember(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateMemberAction(data: Member, path: string): Promise<ActionResult<Member>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Member = await postActivateMember(data.brandUuid, data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateMemberAction(data: Member, path: string): Promise<ActionResult<Member>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Member = await postDeactivateMember(data.brandUuid, data.uuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteMemberAction(data: Member): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'MemberUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    await delMember(data.brandUuid, data.uuid);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
