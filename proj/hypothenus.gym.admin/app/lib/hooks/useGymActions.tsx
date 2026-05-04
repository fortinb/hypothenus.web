"use client";

import { useTransition } from "react";
import { ActionResult } from "@/app/lib/http/result";
import { debugLog } from "@/app/lib/utils/debug";

interface GymActions<Gym> {
  assignCoach: (...args: any[]) => Promise<ActionResult<Gym>>;
  unassignCoach: (...args: any[]) => Promise<ActionResult<Gym>>;
}

interface UseGymActionsParams<Gym> {
  actions: GymActions<Gym>;
}

export function useGymActions<Gym>({ actions}: UseGymActionsParams<Gym>) {
  const [isAssigningCoach, startAssignCoach] = useTransition();

  const assignCoachToGym = (entity: Gym, coachUuid: string, entityPath?: string, onSuccess?: (entity: Gym) => void, onError?: (result: ActionResult<Gym>) => void) => {
    startAssignCoach(async () => {
      const result = await actions.assignCoach(entity, coachUuid, entityPath);

      if (!result.ok) {
        debugLog('assignCoach error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

  const unassignCoachFromGym = (entity: Gym, coachUuid: string, entityPath?: string, onSuccess?: (entity: Gym) => void, onError?: (result: ActionResult<Gym>) => void) => {
    startAssignCoach(async () => {
      const result = await actions.unassignCoach(entity, coachUuid, entityPath);

      if (!result.ok) {
        debugLog('unassignCoach error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

 return {
    isAssigningCoach,
    assignCoachToGym,
    unassignCoachFromGym
  };
}
