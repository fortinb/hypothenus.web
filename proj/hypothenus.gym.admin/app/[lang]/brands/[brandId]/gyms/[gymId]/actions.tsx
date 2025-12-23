"use server"

import { delGym, postActivateGym, postGym, postDeactivateGym, putGym } from '@/app/lib/data/gyms-data-service';
import { Gym } from '@/src/lib/entities/gym';
import { revalidatePath } from 'next/cache';

export async function saveGymAction(brandId: string, gymId: string,data: Gym, path: string): Promise<Gym> {
  // 1. Validation (server-side)
  if (data.brandId !== brandId)
    throw new Error('Brand mismatch');
  if (data.gymId !== gymId)
    throw new Error('Gym mismatch');
  if (!data.id) 
    throw new Error('Id is required');
  
  // 2. Persist (DB, API, etc.)
  let result: Gym = await putGym(brandId, data);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function createGymAction(brandId: string,data: Gym, path: string): Promise<Gym> {
  // 1. Validation (server-side)
  if (data.brandId !== brandId)
    throw new Error('Brand mismatch');

  // 2. Persist (DB, API, etc.)
  let result: Gym = await postGym(brandId, data);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function activateGymAction(brandId: string, gymId: string, path: string): Promise<Gym> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  let result: Gym = await postActivateGym(brandId, gymId);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function deactivateGymAction(brandId: string, gymId: string, path: string): Promise<Gym> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  let result: Gym = await postDeactivateGym(brandId, gymId);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function deleteGymAction(brandId: string, gymId: string): Promise<void> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  await delGym(brandId, gymId);

  return;
}
