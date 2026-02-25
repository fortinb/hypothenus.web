"use server"

import { delUser, postActivateUser, postUser, postDeactivateUser, putUser } from '@/app/lib/services/users-data-service';
import { failure, success } from '@/app/lib/http/handle-result';
import { ActionResult, ErrorType } from '@/app/lib/http/result';
import { User } from '@/src/lib/entities/user';
import { revalidatePath } from 'next/cache';

export async function saveUserAction(data: User, path: string): Promise<ActionResult<User>> {
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'UserUuid is required' });

  try {
    let result: User = await putUser(data);
    revalidatePath(path);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function createUserAction(data: User): Promise<ActionResult<User>> {
  if (!data.email)
    return failure({ type: ErrorType.Validation, message: 'User email is required' });

  try {
    let result: User = await postUser(data);

    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function activateUserAction(data: User, path: string): Promise<ActionResult<User>> {
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'UserUuid is required' });

  try {
    let result: User = await postActivateUser(data.uuid);
    revalidatePath(path);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deactivateUserAction(data: User, path: string): Promise<ActionResult<User>> {
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'UserUuid is required' });

  try {
    let result: User = await postDeactivateUser(data.uuid);
    revalidatePath(path);
    return success(result);
  } catch (error: any) {
    return failure(error);
  }
}

export async function deleteUserAction(data: User): Promise<ActionResult<void>> {
  if (!data.uuid)
    return failure({ type: ErrorType.Validation, message: 'UserUuid is required' });

  try {
    await delUser(data.uuid);
    return success(undefined);
  } catch (error: any) {
    return failure(error);
  }
}
