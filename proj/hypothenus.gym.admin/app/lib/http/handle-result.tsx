import { redirect } from 'next/navigation';
import { ActionResult, ErrorType, ResultError } from './result';
import { debugLog } from '@/app/lib/utils/debug';

export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function failure<T>(error: ResultError): ActionResult<T> {

  switch (error.type) {
    case ErrorType.Forbidden:
    case ErrorType.Unauthorized:
      debugLog ("Unauthorized or forbidden access", error);
      // Redirect to the sign-out route which will perform cookie cleanup
      // in a Server Route Handler.
      redirect('/api/auth/signout');
    case ErrorType.NotFound:
    case ErrorType.NotAvailable:
      redirect('/error');
    default:
      return { ok: false, error };
  }
}