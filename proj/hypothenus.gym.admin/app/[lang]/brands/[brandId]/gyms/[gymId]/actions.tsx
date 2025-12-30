"use server"

import { delGym, postActivateGym, postGym, postDeactivateGym, putGym } from '@/app/lib/data/gyms-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Gym } from '@/src/lib/entities/gym';
import { revalidatePath } from 'next/cache';

export async function saveGymAction(brandId: string, gymId: string,data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and Id are required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });

  try {
    // 2. Persist 
    let result: Gym = await putGym(brandId, data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createGymAction(brandId: string, data: Gym): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });

  try {
    // 2. Persist
    let result: Gym = await postGym(brandId, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateGymAction(brandId: string, gymId: string, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId and GymId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postActivateGym(brandId, gymId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateGymAction(brandId: string, gymId: string, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId and GymId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postDeactivateGym(brandId, gymId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteGymAction(brandId: string, gymId: string): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId and GymId are required' });
  
  try {
    // 2. Persist (DB, API, etc.)
    await delGym(brandId, gymId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
