import axios from 'axios'
import { normalizeApiError } from './action-result';

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["x-tracking-number"] = "1234";
    config.headers["x-credentials"] = "Bruno Fortin";
    config.headers["x-authorization"] = "{ \"roles\" : [\"admin\"] }";

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
    // Modify the response data here (e.g., parse, transform)
    return response;
  },
  (error) => {
    try {
      console.log(error);

      const normalizedError = normalizeApiError(error);
      return Promise.reject(normalizedError);
    } catch (e) {
      console.log(e);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;; 