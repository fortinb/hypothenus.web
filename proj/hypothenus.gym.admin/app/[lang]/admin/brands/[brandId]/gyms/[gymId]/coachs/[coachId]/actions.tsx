"use server"

import { delCoach, postActivateCoach, postCoach, postDeactivateCoach, putCoach } from '@/app/lib/services/coachs-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { Coach } from '@/src/lib/entities/coach';
import { revalidatePath } from 'next/cache';

export async function saveCoachAction(data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' });    

  try {
    // 2. Persist 
    let result: Coach = await putCoach(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCoachAction(data: Coach): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  

  try {
    // 2. Persist
    let result: Coach = await postCoach(data);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCoachAction(data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' }); 

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postActivateCoach(data.brandUuid, data.gymUuid, data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCoachAction(data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' }); 

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postDeactivateCoach(data.brandUuid, data.gymUuid, data.uuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCoachAction(data: Coach): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CoachUuid is required' }); 
  
  try {
    // 2. Persist (DB, API, etc.)
    await delCoach(data.brandUuid, data.gymUuid, data.uuid);
    
    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
