"use server"

import { Gym } from "@/src//lib/entities/gym";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../http/axiosInterceptor";

export async function fetchGyms(token : String, trackingNumber: String, pageNumber: number, pageSize: number, includeInactive: boolean): Promise<Page<Gym>> {

  const listURI : String  = "/v1/admin/gyms";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: {
      page: pageNumber,
      pageSize : pageSize,
      includeInactive: includeInactive
    },
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number" : trackingNumber.valueOf()
    }
  };

  let  response = await axiosInstance.get(listURI.valueOf(), requestContext);

  return response.data;
}

export async function searchGyms(token : String, trackingNumber: String, pageNumber: number, pageSize: number, criteria: String): Promise<Page<Gym>> {

  const searchURI : String  = "/v1/admin/gyms/search";
  
  const requestContext: AxiosRequestConfig = 
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: {
      page: pageNumber,
      pageSize : pageSize,
      criteria: criteria
    },
    headers: { "Authorization": token.valueOf(),
               "x-tracking-number" : trackingNumber.valueOf()
    }
  };

  let  response = await axiosInstance.get(searchURI.valueOf(), requestContext);

  return response.data;
}