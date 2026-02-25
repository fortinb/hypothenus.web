"use server"

import { delGym, postActivateGym, postGym, postDeactivateGym, putGym } from '@/app/lib/services/gyms-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { Gym } from '@/src/lib/entities/gym';
import { revalidatePath } from 'next/cache';

export async function saveGymAction(data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid || !data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid and GymUuid are required' });

  try {
    // 2. Persist 
    let result: Gym = await putGym(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createGymAction(data: Gym): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.code)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });

  try {
    // 2. Persist
    let result: Gym = await postGym(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateGymAction(data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postActivateGym(data.brandUuid, data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateGymAction(data: Gym, path: string): Promise<ActionResult<Gym>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    let result: Gym = await postDeactivateGym(data.brandUuid, data.uuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteGymAction(data: Gym): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  


  try {
    // 2. Persist (DB, API, etc.)
    await delGym(data.brandUuid, data.uuid);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
