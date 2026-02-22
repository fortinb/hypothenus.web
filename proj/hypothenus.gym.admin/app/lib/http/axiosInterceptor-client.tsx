"use client";

import axios from "axios";
import { normalizeApiError } from "./action-result";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["x-tracking-number"] = crypto.randomUUID();
    const session = await getSession(); 
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

      // Handle response errors here
      const normalizedError = normalizeApiError(error);
      return Promise.reject(normalizedError);
    } catch (e) {
      console.log(e);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;