"use server"

import { Gym } from "@/src//lib/entities/gym";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../http/axiosInterceptor";

export async function fetchGyms(token : String, trackingNumber: String, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Gym>> {

  const listURI : String  = "/v1/admin/gyms";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: {
      page: page,
      pageSize : pageSize,
      includeInactive: includeInactive
    },
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.get(listURI.valueOf(), requestContext);

  return response.data;
}

export async function searchGyms(token : String, trackingNumber: String, page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<Page<Gym>> {

  const searchURI : String  = "/v1/admin/gyms/search";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: {
      page: page,
      pageSize : pageSize,
      criteria: criteria,
      includeInactive: includeInactive
    },
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.get(searchURI.valueOf(), requestContext);

  return response.data;
}

export async function getGym(token : String, trackingNumber: String, gymId: string): Promise<Gym> {

  const getURI : String  = "/v1/admin/gyms/" + gymId;
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.get(getURI.valueOf(), requestContext);

  return response.data;
}

export async function activateGym(token : String, trackingNumber: String, gymId: string): Promise<Gym> {

  const getURI : String  = "/v1/admin/gyms/" + gymId + "/activate";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.post(getURI.valueOf(), {}, requestContext);

  return response.data;
}

export async function deactivateGym(token : String, trackingNumber: String, gymId: string): Promise<Gym> {

  const postURI : String  = "/v1/admin/gyms/" + gymId + "/deactivate";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.post(postURI.valueOf(), {}, requestContext);

  return response.data;
}

export async function deleteGym(token : String, trackingNumber: String, gymId: string): Promise<void> {

  const deleteURI : String  = "/v1/admin/gyms/" + gymId;
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.delete(deleteURI.valueOf(), requestContext);

  return response.data;
}

export async function createGym(token : String, trackingNumber: String, gym: Gym): Promise<Gym> {

  const postURI : String  = "/v1/admin/gyms";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let response = await axiosInstance.post(postURI.valueOf(), gym, requestContext);

  return response.data;
}

export async function saveGym(token : String, trackingNumber: String, gym: Gym): Promise<Gym> {

  const putURI : String  = "/v1/admin/gyms/" + gym.gymId;
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number": trackingNumber.valueOf()
    }
  };

  let  response = await axiosInstance.put(putURI.valueOf(), gym, requestContext);

  return response.data;
}