"use server"

import { delCourse, postActivateCourse, postCourse, postDeactivateCourse, putCourse } from '@/app/lib/services/courses-data-service';
import { ActionResult, ErrorType, failure, success } from '@/app/lib/http/action-result';
import { Course } from '@/src/lib/entities/course';
import { revalidatePath } from 'next/cache';

export async function saveCourseAction(data: Course, path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CourseUuid is required' });  

  try {
    // 2. Persist 
    let result: Course = await putCourse(data);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createCourseAction(data: Course): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });   

  try {
    // 2. Persist
    let result: Course = await postCourse(data);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateCourseAction(data: Course,path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CourseUuid is required' });  

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postActivateCourse(data.brandUuid, data.gymUuid, data.uuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateCourseAction(data: Course,path: string): Promise<ActionResult<Course>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CourseUuid is required' });  

  try {
    // 2. Persist (DB, API, etc.)
    let result: Course = await postDeactivateCourse(data.brandUuid, data.gymUuid, data.uuid);
    // 3. Revalidate cached pages
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteCourseAction(data: Course): Promise<ActionResult<void>> {
  // 1. Validation (server-side)
   if (!data.brandUuid)
    return failure({ type: ErrorType.Validation, message: 'BrandUuid is required' });
  if (!data.gymUuid)
    return failure({ type: ErrorType.Validation, message: 'GymUuid is required' });  
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'CourseUuid is required' });  
  
  try {
    // 2. Persist (DB, API, etc.)
    await delCourse(data.brandUuid, data.gymUuid, data.uuid);
    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
