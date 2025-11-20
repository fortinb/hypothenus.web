"use server"

import { Brand } from "@/src//lib/entities/brand";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../http/axiosInterceptor";
import { RequestContext } from "../http/requestContext";

function initRequest(requestContext: RequestContext, params: any): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: {
      "Authorization": requestContext.token,
      "x-tracking-number": requestContext.trackingNumber
    },
    params: params
  }

  return request;
}

export async function fetchBrands(requestContext: RequestContext, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Brand>> {

  const listURI: String = "/v1/brands";

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function searchBrands(requestContext: RequestContext, page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<Page<Brand>> {

  const searchURI: String = "/v1/brands/search";

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    criteria: criteria,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(searchURI.valueOf(), request);

  return response.data;
}

export async function getBrand(requestContext: RequestContext, brandId: string): Promise<Brand> {

  const getURI: String = `/v1/brands/${brandId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function activateBrand(requestContext: RequestContext, brandId: string): Promise<Brand> {

  const getURI: String = `/v1/brands/${brandId}/activate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(getURI.valueOf(), {}, request);

  return response.data;
}

export async function deactivateBrand(requestContext: RequestContext, brandId: string): Promise<Brand> {

  const postURI: String = `/v1/brands/${brandId}/deactivate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function deleteBrand(requestContext: RequestContext, brandId: string): Promise<void> {

  const deleteURI: String = `/v1/brands/${brandId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.delete(deleteURI.valueOf(), request);

  return response.data;
}

export async function createBrand(requestContext: RequestContext, brand: Brand): Promise<Brand> {

  const postURI: String = "/v1/brands";

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), brand, request);

  return response.data;
}

export async function updateBrand(requestContext: RequestContext, brand: Brand): Promise<Brand> {

  const putURI: String = `/v1/brands/${brand.brandId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.put(putURI.valueOf(), brand, request);

  return response.data;
}