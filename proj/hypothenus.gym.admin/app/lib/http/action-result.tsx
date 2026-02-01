import axios from 'axios'

export enum ErrorType {
    Validation = 'validation',
    Unauthorized = 'unauthorized',
    Forbidden = 'forbidden',
    Conflict = 'conflict',
    Server = 'server',
    NotAvailable = 'notAvailable',
    Unknown = 'unknown'
}

export type ResultError = {
    type?: ErrorType;
    status?: number;
    message: string;
    field?: string;
    details?: any;  
};

export type ActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ResultError };

export function success<T>(data: T): ActionResult<T> {
    return { ok: true, data };
}

export function failure<T>(error: ResultError): ActionResult<T> {
    return { ok: false, error };
}

export function normalizeApiError(error: unknown): ResultError {
  if (!axios.isAxiosError(error)) {
    return { type: ErrorType.Unknown, message: 'An unknown error occurred' };
  }
  if (error.code && error.code === 'ECONNREFUSED') {
    return { type: ErrorType.NotAvailable, message: 'http.status.503' };
  }

  const status = error.response?.status;
  switch (status) {
    case 400:
      return { status: status, type: ErrorType.Validation, details: error.response?.data, message: 'http.status.400' };
    case 401:
      return { status: status, type: ErrorType.Unauthorized, message: 'http.status.401' };
    case 403:
      return { status: status, type: ErrorType.Forbidden, message: 'http.status.403' };
    case 409:
      return { status: status, type: ErrorType.Conflict, message: 'http.status.409' };
    case 503:
      return { status: status, type: ErrorType.NotAvailable, message: 'http.status.503' };      
    default:
      return { status: status, type: ErrorType.Server, details: error.response?.data, message: 'http.status.500' };
  }
}