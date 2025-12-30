import axios from 'axios'
import { ErrorType, ResultError } from './action-result';

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["x-tracking-number"] = "1234";
    config.headers["x-credentials"] = "Bruno Fortin";
    config.headers["x-authorization"] = "{ \"roles\" : [\"Admin\"] }";

    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors here
    const normalizedError = normalizeApiError(error);
    return Promise.reject(normalizedError);
  }
);

function normalizeApiError(error: unknown): ResultError {
  if (!axios.isAxiosError(error)) {
    return { type: ErrorType.Unknown, message: 'An unknown error occurred' };
  }

  const status = error.response?.status;

  switch (status) {
    case 400:
      return { type: ErrorType.Validation, details: error.response?.data, message: 'validation error' };
    case 401:
      return { type: ErrorType.Unauthorized, message: 'Unauthorized' };
    case 403:
      return { type: ErrorType.Forbidden, message: 'Forbidden' };
    case 409:
      return { type: ErrorType.Conflict, message: 'Conflict' };
    default:
      return { type: ErrorType.Server, message: error.response?.data || 'An unknown error occurred' };
  }
}

export default axiosInstance;; 