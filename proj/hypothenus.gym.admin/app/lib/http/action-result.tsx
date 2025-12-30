
export enum ErrorType {
    Validation = 'validation',
    Unauthorized = 'unauthorized',
    Forbidden = 'forbidden',
    Conflict = 'conflict',
    Server = 'server',
    Unknown = 'unknown'
}

export type ResultError = {
    type?: ErrorType;
    code?: string;
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