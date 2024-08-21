"use server";

import axios from 'axios'

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.ENVIRONMENT != 'prod') {
      config.headers["x-credentials"] = "Bruno Fortin";
      config.headers["x-authorization"] = "{ \"roles\" : [\"Admin\"] }";
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
    console.log(error);

    // Handle response errors here
    switch (error?.response?.status) {
      case 401:
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;; 