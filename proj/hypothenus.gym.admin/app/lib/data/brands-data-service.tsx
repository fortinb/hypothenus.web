"use client"

import { Brand } from "@/src/lib/entities/brand";
import { Page } from "@/src/lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor";

function initRequest(params: any): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
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

export async function getBrand( brandId: string): Promise<Brand> {

  const getURI: String = `/v1/brands/${brandId}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function postActivateBrand(brandId: string): Promise<Brand> {

  const postURI: String = `/v1/brands/${brandId}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function postDeactivateBrand(brandId: string): Promise<Brand> {

  const postURI: String = `/v1/brands/${brandId}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function delBrand(brandId: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandId}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postBrand(brand: Brand): Promise<Brand> {

  const postURI: String = "/v1/brands";

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), brand, request);

  return response.data;
}

export async function putBrand(brand: Brand): Promise<Brand> {

  const putURI: String = `/v1/brands/${brand.brandId}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), brand, request);

  return response.data;
}