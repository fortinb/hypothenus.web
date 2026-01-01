"use client";

import { useTransition } from "react";
import { ActionResult } from "@/app/lib/http/action-result";

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

  const createEntity = (entity: T, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startSave(async () => {
      const result = await actions.create(entity);

      if (!result.ok) {
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const saveEntity = (entityId: string, entity: T, entityPath?: string, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startSave(async () => {
      const result = await actions.save(entityId, entity, entityPath);

      if (!result.ok) {
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const activateEntity = (entityId: string, entity: T, entityPath?: string, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startActivate(async () => {
      const result = await actions.activate(entityId, entity, entityPath);

      if (!result.ok) {
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const deactivateEntity = (entityId: string, entity: T, entityPath?: string, onSuccess?: (entity: T) => void, onError?: (result: ActionResult<T>) => void) => {
    startActivate(async () => {
      const result = await actions.deactivate(entityId, entity, entityPath);

      if (!result.ok) {
        onError?.(result);
        return;
      }
      
      onSuccess?.(result.data);
    });
  };

  const deleteEntity = (entityId: string, entity: T, entityPath?: string, onSuccess?: () => void, onError?: (result: ActionResult<T>) => void) => {
    startDelete(async () => {
      const result = await actions.delete(entityId, entity, entityPath);

      if (!result.ok) {
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
