"use client";

import axios from "axios";
import { normalizeApiError } from "./result";
import { getSession, signOut } from "next-auth/react";
import { logout } from "@/src/security/actions";
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
    return response;
  },
  async (error) => {
    try {
      console.log(error);

      // Handle response errors here
      const normalizedError = normalizeApiError(error);
      if (normalizedError?.status === 401) {
        await logout();
      }
      
      return Promise.reject(normalizedError);
    } catch (e) {
      console.log(e);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;