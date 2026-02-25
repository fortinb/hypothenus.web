import axios from 'axios';
import { auth } from "@/src/security/auth";
import { normalizeApiError } from './result';

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
    return response;
  },
  (error) => {
    try {
      const normalizedError = normalizeApiError(error);
      
      return Promise.reject(normalizedError);
    } catch (e) {
       return Promise.reject(error);
    }
  }
);

export default axiosInstance;; 