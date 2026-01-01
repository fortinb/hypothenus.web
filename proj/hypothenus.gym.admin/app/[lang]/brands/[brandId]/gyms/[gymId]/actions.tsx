"use server"

import { delGym, postActivateGym, postGym, postDeactivateGym, putGym } from '@/app/lib/data/gyms-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Gym } from '@/src/lib/entities/gym';
import { revalidatePath } from 'next/cache';

export async function saveGymAction(gymId: string, data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandId || !gymId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and Id are required' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });

  try {
    // 2. Persist 
    let result: Gym = await putGym(data.brandId, data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createGymAction(data: Gym): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });

  try {
    // 2. Persist
    let result: Gym = await postGym(data.brandId, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateGymAction(gymId: string, data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postActivateGym(data.brandId, gymId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateGymAction(gymId: string, data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postDeactivateGym(data.brandId, gymId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteGymAction(gymId: string, data: Gym): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    await delGym(data.brandId, gymId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
