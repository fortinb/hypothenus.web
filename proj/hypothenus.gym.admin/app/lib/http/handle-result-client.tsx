"use client"

import { signOut } from "@/src/security/auth";
import { ActionResult, ErrorType, ResultError } from "./result";


export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export async function failure<T>(error: ResultError): Promise<ActionResult<T>> {

  switch (error.type) {
    case ErrorType.Forbidden:
    case ErrorType.Unauthorized:
      console.log ("Unauthorized or forbidden access", error);
      // Redirect to the sign-out route which will perform cookie cleanup
        return await signOut({ redirectTo: '/', redirect: true });
   default:
      return { ok: false, error };
  }
}