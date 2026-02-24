import axios from 'axios'
import { redirect } from 'next/navigation';
import { signOut } from "@/src/security/auth"

export enum ErrorType {
  Validation = 'validation',
  Unauthorized = 'unauthorized',
  Forbidden = 'forbidden',
  Conflict = 'conflict',
  Server = 'server',
  NotAvailable = 'notAvailable',
  NotFound = 'notFound',
  Unknown = 'unknown'
}

export type ResultError = {
  type?: ErrorType;
  status?: number;
  message: string;
  field?: string;
  details?: any;
  e?: Error;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ResultError };

export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function failure<T>(error: ResultError): ActionResult<T> {

  switch (error.type) {
    case ErrorType.Forbidden:
    case ErrorType.Unauthorized:
      signOut({ redirectTo: '/', redirect: true });
    case ErrorType.NotFound:
    case ErrorType.NotAvailable:
      return redirect('/error');
    default:
      return { ok: false, error };
  }
}

export function normalizeApiError(error: unknown): ResultError {
  if (!axios.isAxiosError(error)) {
    return { type: ErrorType.Unknown, message: 'An unknown error occurred', e: error as Error };
  }

  if (error.code && error.code === 'ECONNREFUSED') {
    return { type: ErrorType.NotAvailable, message: 'http.status.503', e: error };
  }

  const status = error.response?.status;
  switch (status) {
    case 400:
      return { status: status, type: ErrorType.Validation, details: error.response?.data, message: 'http.status.400', e: error };
    case 401:
      return { status: status, type: ErrorType.Unauthorized, message: 'http.status.401', e: error };
    case 403:
      return { status: status, type: ErrorType.Forbidden, message: 'http.status.403', e: error };
    case 404:
      return { status: status, type: ErrorType.NotFound, message: 'http.status.404', e: error };
    case 409:
      return { status: status, type: ErrorType.Conflict, message: 'http.status.409', e: error };
    case 503:
      return { status: status, type: ErrorType.NotAvailable, message: 'http.status.503', e: error };
    default:
      return { status: status, type: ErrorType.Server, details: error.response?.data, message: 'http.status.500', e: error };
  }
}