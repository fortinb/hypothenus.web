"use client";

import { useTransition } from "react";
import { ActionResult } from "@/app/lib/http/handle-result";

interface CrudActions<T> {
  create: (...args: any[]) => Promise<ActionResult<T>>;
  save: (...args: any[]) => Promise<ActionResult<T>>;
  activate: (...args: any[]) => Promise<ActionResult<T>>;
  deactivate: (...args: any[]) => Promise<ActionResult<T>>;
  delete: (...args: any[]) => Promise<ActionResult<void>>;
}

interface UseCrudActionsParams<T> {
  actions: CrudActions<T>;
}

export function useCrudActions<T>({
  actions
}: UseCrudActionsParams<T>) {
  const [isSaving, startSave] = useTransition();
  const [isActivating, startActivate] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const createEntity = (entity: T, beforeSave?: (entity: T) => void, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startSave(async () => {
      beforeSave?.(entity);
      
      const result = await actions.create(entity);

      if (!result.ok) {
        console.log('createEntity error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const saveEntity = (entity: T, entityPath?: string, beforeSave?: (entity: T) => void, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startSave(async () => {
      beforeSave?.(entity);

      const result = await actions.save(entity, entityPath);

      if (!result.ok) {
        console.log('saveEntity error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const activateEntity = (entity: T, entityPath?: string, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startActivate(async () => {
      const result = await actions.activate(entity, entityPath);

      if (!result.ok) {
        console.log('activateEntity error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const deactivateEntity = (entity: T, entityPath?: string, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startActivate(async () => {
      const result = await actions.deactivate(entity, entityPath);

      if (!result.ok) {
        console.log('deactivateEntity error', result);
        onError?.(result);
        return;
      }
      
      onSuccess?.(result.data);
    });
  };

  const deleteEntity = (entity: T, entityPath?: string, onSuccess?: () => void, onError?: (result: ActionResult<T>) => void) => {
    startDelete(async () => {
      const result = await actions.delete(entity, entityPath);

      if (!result.ok) {
        console.log('deleteEntity error', result);
        onError?.(result);
        return;
      }

      onSuccess?.();
    });
  };

  return {
    isSaving,
    isActivating,
    isDeleting,
    createEntity,
    saveEntity,
    activateEntity,
    deactivateEntity,
    deleteEntity
  };
}
