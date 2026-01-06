"use server"

import { delBrand, postActivateBrand, postBrand, postDeactivateBrand, putBrand } from '@/app/lib/services/brands-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Brand } from '@/src/lib/entities/brand';
import { revalidatePath } from 'next/cache';

export async function saveBrandAction(brandId: string, data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!data.brandId || !data.id || !brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId mismatch' });

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
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });

  try {
    // 2. Persist
    let result: Brand = await postBrand(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateBrandAction(brandId: string, data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId mismatch' });  

  try {
    // 2. Persist (DB, API, etc.)
    let result: Brand = await postActivateBrand(brandId);

    // 3. Revalidate cached pages
    revalidatePath(path);
    
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateBrandAction(brandId: string, data: Brand, path: string): Promise<ActionResult<Brand>> {
  // 1. Validation (server-side)
  if (!brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId mismatch' });    

  try {
    // 2. Persist (DB, API, etc.)
    let result: Brand = await postDeactivateBrand(brandId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteBrandAction(brandId: string, data: Brand): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });  
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId mismatch' });  
  
  try {
    // 2. Persist (DB, API, etc.)
    await delBrand(brandId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
