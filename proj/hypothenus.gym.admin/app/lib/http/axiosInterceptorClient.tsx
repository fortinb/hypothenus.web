"use client"

import axios from 'axios'

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config here (e.g., add headers, authentication tokens)
    config.headers['content-type'] = "application/json";
    config.headers["x-tracking-number"] = "1234";
    config.headers["authorization"] = "{ \"roles\" : [\"Admin\"] }";

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
    console.log(error);

    // Handle response errors here
    switch (error.response.status) {
      case 401:
        break;
      default:
        break;
    }

    return Promise.reject(error as Error);
  }
);

export default axiosInstance;; 