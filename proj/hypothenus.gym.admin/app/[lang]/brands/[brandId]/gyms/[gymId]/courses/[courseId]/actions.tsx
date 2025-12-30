"use server"

import { delCourse, postActivateCourse, postCourse, postDeactivateCourse, putCourse } from '@/app/lib/data/courses-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Course } from '@/src/lib/entities/course';
import { revalidatePath } from 'next/cache';

export async function saveCourseAction(brandId: string, gymId: string, courseId: string, data: Course, path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !courseId || !data.id)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId, CourseId and Id are required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });
  if (data.id !== courseId) 
    return failure({ type: ErrorType.Validation, message: 'Course mismatch' });

  try {
    // 2. Persist 
    let result: Course = await putCourse(brandId, gymId, courseId, data);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCourseAction(brandId: string, gymId: string, data: Course): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId)
    return failure({ type: ErrorType.Validation, message: 'BrandId and GymId are required' });
  if (data.brandId !== brandId)
    return failure({ type: ErrorType.Validation, message: 'Brand mismatch' });
  if (data.gymId !== gymId)
    return failure({ type: ErrorType.Validation, message: 'Gym mismatch' });  

  try {
    // 2. Persist
    let result: Course = await postCourse(brandId, gymId, data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCourseAction(brandId: string, gymId: string, courseId: string, path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !courseId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CourseId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postActivateCourse(brandId, gymId, courseId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCourseAction(brandId: string, gymId: string,courseId: string, path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !courseId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CourseId are required' });

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postDeactivateCourse(brandId, gymId, courseId);

    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCourseAction(brandId: string, gymId: string,courseId: string): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
  if (!brandId || !gymId || !courseId)
    return failure({ type: ErrorType.Validation, message: 'BrandId, GymId and CourseId are required' });
  
  try {
    // 2. Persist (DB, API, etc.)
    await delCourse(brandId, gymId, courseId);

    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
