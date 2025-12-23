"use client"

import { Brand } from "@/src/lib/entities/brand";
import { Page } from "@/src/lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";

function initRequest(params: any): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.NEXT_PUBLIC_HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: params
  }

  return request;
}

export async function fetchBrands(page: number, pageSize: number, includeInactive: boolean): Promise<Page<Brand>> {

  const listURI: String = "/v1/brands";

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function searchBrands(page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<Page<Brand>> {

  const searchURI: String = "/v1/brands/search";

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    criteria: criteria,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(searchURI.valueOf(), request);

  return response.data;
}



