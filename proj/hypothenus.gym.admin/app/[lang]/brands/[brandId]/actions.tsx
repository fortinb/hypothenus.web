"use server"

import { delBrand, postActivateBrand, postBrand, postDeactivateBrand, putBrand } from '@/app/lib/data/brands-data-service';
import { Brand } from '@/src/lib/entities/brand';
import { revalidatePath } from 'next/cache';

export async function saveBrandAction(brandId: string, data: Brand, path: string): Promise<Brand> {
  // 1. Validation (server-side)
  if (!data.id)
    throw new Error('Id is required');
  if (data.brandId !== brandId)
    throw new Error('Brand mismatch');

  // 2. Persist (DB, API, etc.)
  let result: Brand = await putBrand(data);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function createBrandAction(data: Brand, path: string): Promise<Brand> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  let result: Brand = await postBrand(data);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function activateBrandAction(brandId: string, path: string): Promise<Brand> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  let result: Brand = await postActivateBrand(brandId);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function deactivateBrandAction(brandId: string, path: string): Promise<Brand> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  let result: Brand = await postDeactivateBrand(brandId);

  // 3. Revalidate cached pages
  revalidatePath(path);

  return result;
}

export async function deleteBrandAction(brandId: string): Promise<void> {
  // 1. Validation (server-side)

  // 2. Persist (DB, API, etc.)
  await delBrand(brandId);

  return;
}
