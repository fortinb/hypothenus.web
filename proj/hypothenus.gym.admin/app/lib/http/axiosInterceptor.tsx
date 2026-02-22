import axios from 'axios'
import { normalizeApiError } from './action-result';
import {auth} from "@/src/security/auth";

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await auth();

    config.headers["x-tracking-number"] = crypto.randomUUID();

    if (session?.accessToken) {
      config.headers["Authorization"] = "Bearer " + session.accessToken;
    }
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