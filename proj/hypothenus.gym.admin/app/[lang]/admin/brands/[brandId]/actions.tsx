"use server"

import { delBrand, postActivateBrand, postBrand, postDeactivateBrand, putBrand } from '@/app/lib/services/brands-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { Brand } from '@/src/lib/entities/brand';
import { revalidatePath } from 'next/cache';

export async function saveBrandAction(data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist 
    let result: Brand = await putBrand(data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createBrandAction(data: Brand): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!data.code)
    return failure({ type: ErrorType.Validation, message: 'Brand code is required' });

  try {
    // 2. Persist
    let result: Brand = await postBrand(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateBrandAction(data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Brand = await postActivateBrand(data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);
    
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateBrandAction(data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Brand = await postDeactivateBrand(data.uuid);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteBrandAction(data: Brand): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });  
  
  try {
    // 2. Persist (DB, API, etc.)
    await delBrand(data.uuid);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
