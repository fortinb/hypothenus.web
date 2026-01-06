"use server"

import { delCourse, postActivateCourse, postCourse, postDeactivateCourse, putCourse } from '@/app/lib/services/courses-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Course } from '@/src/lib/entities/course';
import { revalidatePath } from 'next/cache';

export async function saveCourseAction(courseId: string, data: Course, path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!data.brandId || !data.gymId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and Id are required' });  
  if (!courseId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'CourseId and Id are required' });
  if (data.id !== courseId) 
    return failure({ type: ErrorType.Validation, message: 'Course mismatch' });

  try {
    // 2. Persist 
    let result: Course = await putCourse(data.brandId, data.gymId, courseId, data);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCourseAction(data: Course): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!data.brandId || !data.gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId are required' });  

  try {
    // 2. Persist
    let result: Course = await postCourse(data.brandId, data.gymId, data);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCourseAction(courseId: string, data: Course,path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== courseId)
    return failure({ type: ErrorType.Validation, message: 'Course mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postActivateCourse(data.brandId, data.gymId, courseId);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCourseAction(courseId: string, data: Course,path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== courseId)
    return failure({ type: ErrorType.Validation, message: 'Course mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postDeactivateCourse(data.brandId, data.gymId, courseId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCourseAction(courseId: string, data: Course): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!data.brandId)
    return failure({ type: ErrorType.Validation, message: 'BrandId is required' });
  if (!data.gymId)
    return failure({ type: ErrorType.Validation, message: 'GymId is required' });  
  if (data.id !== courseId)
    return failure({ type: ErrorType.Validation, message: 'Course mismatch' });

  try {
    // 2. Persist (DB, API, etc.)
    await delCourse(data.brandId, data.gymId, courseId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
