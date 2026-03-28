"use client";

import { useTransition } from "react";
import { ActionResult } from "@/app/lib/http/result";
import { debugLog } from "@/app/lib/utils/debug";
import { Gym } from "@/src/lib/entities/gym";

interface GymActions<Gym> {
  assignCoach: (...args: any[]) => Promise<ActionResult<Gym>>;
  unassignCoach: (...args: any[]) => Promise<ActionResult<Gym>>;
}

interface UseGymActionsParams<Gym> {
  actions: GymActions<Gym>;
}

export function useGymActions<Gym>({
  actions
}: UseGymActionsParams<Gym>) {
  const [isAssignCoach, startAssignCoach] = useTransition();

  const assignCoachToGym = (entity: Gym, coachUuid: string, entityPath?: string, onSuccess?: (entity: Gym) => void, onError?: (result: ActionResult<Gym>) => void) => {
    startAssignCoach(async () => {
      const result = await actions.assignCoach(entity, coachUuid);

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
      const result = await actions.unassignCoach(entity, coachUuid);

      if (!result.ok) {
        debugLog('unassignCoach error', result);
        onError?.(result);
        return;
      }

      onSuccess?.(result.data);
    });
  };

 return {
    isAssignCoach,
    assignCoachToGym,
    unassignCoachFromGym
  };
}
