"use server"

import { delCoach, postActivateCoach, postCoach, postDeactivateCoach, putCoach } from '@/app/lib/data/coachs-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Coach } from '@/src/lib/entities/coach';
import { revalidatePath } from 'next/cache';

export async function saveCoachAction(coachId: string, data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!data.brandId || !data.gymId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and Id are required' });  
  if (!coachId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'CoachId and Id are required' });
  if (data.id !== coachId) 
    return failure({ type: ErrorType.Validation, message: 'Coach mismatch' });

  try {
    // 2. Persist 
    let result: Coach = await putCoach(data.brandId, data.gymId, coachId, data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCoachAction(data: Coach): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!data.brandId || !data.gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId are required' });  

  try {
    // 2. Persist
    let result: Coach = await postCoach(data.brandId, data.gymId, data);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCoachAction(coachId: string, data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== coachId)
    return failure({ type: ErrorType.Validation, message: 'Coach mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postActivateCoach(data.brandId, data.gymId, coachId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCoachAction(coachId: string, data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== coachId)
    return failure({ type: ErrorType.Validation, message: 'Coach mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postDeactivateCoach(data.brandId, data.gymId, coachId);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCoachAction(coachId: string, data: Coach): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== coachId)
    return failure({ type: ErrorType.Validation, message: 'Coach mismatch' });
  
  try {
    // 2. Persist (DB, API, etc.)
    await delCoach(data.brandId, data.gymId, coachId);
    
    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
