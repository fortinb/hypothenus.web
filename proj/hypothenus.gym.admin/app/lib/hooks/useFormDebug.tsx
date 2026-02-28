import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { debugLog, isDebug } from "@/app/lib/utils/debug";

export function useFormDebug<T extends FieldValues = FieldValues>(formContext: UseFormReturn<T>) {
  useEffect(() => {
    if (!isDebug()) return;

    const subscription = formContext.watch(() => {
      const hasErrors = Object.keys(formContext.formState.errors).length > 0;
      if (hasErrors) {
        debugLog("Current Form errors:", formContext.formState.errors);
      }
    });

    return () => { (subscription as any)?.unsubscribe?.(); };
  }, [formContext]);
}
