"use server"

import { delCoach, postActivateCoach, postCoach, postDeactivateCoach, putCoach } from '@/app/lib/data/coachs-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Coach } from '@/src/lib/entities/coach';
import { revalidatePath } from 'next/cache';

export async function saveCoachAction(brandId: string, gymId: string, coachId: string, data: Coach, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !coachId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId, CoachId and Id are required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });
  if (data.id !== coachId) 
    return failure({ type: ErrorType.Validation, message: 'Coach mismatch' });

  try {
    // 2. Persist 
    let result: Coach = await putCoach(brandId, gymId, coachId, data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCoachAction(brandId: string, gymId: string, data: Coach): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId and GymId are required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });  

  try {
    // 2. Persist
    let result: Coach = await postCoach(brandId, gymId, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCoachAction(brandId: string, gymId: string, coachId: string, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !coachId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CoachId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postActivateCoach(brandId, gymId, coachId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCoachAction(brandId: string, gymId: string,coachId: string, path: string): Promise<ActionResult<Coach>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !coachId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CoachId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Coach = await postDeactivateCoach(brandId, gymId, coachId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCoachAction(brandId: string, gymId: string,coachId: string): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !coachId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CoachId are required' });
  
  try {
    // 2. Persist (DB, API, etc.)
    await delCoach(brandId, gymId, coachId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
