"use server"

import { postMember } from '@/app/lib/services/members-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/handle-result';
import { Member } from '@/src/lib/entities/member';

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