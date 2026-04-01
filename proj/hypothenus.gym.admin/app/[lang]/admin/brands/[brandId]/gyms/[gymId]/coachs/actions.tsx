"use server"

import { postAssignCoach, postUnassignCoach } from '@/app/lib/services/gyms-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { Gym } from '@/src/lib/entities/gym';
import { revalidatePath } from 'next/cache';

export async function assignCoachAction(data: Gym, coachUuid: string, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!coachUuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postAssignCoach(data.brandUuid, data.uuid, coachUuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function unassignCoachAction(data: Gym, coachUuid: string, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!coachUuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postUnassignCoach(data.brandUuid, data.uuid, coachUuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}