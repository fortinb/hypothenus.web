"use client"

import { Brand } from "@/src/lib/entities/brand";
import { Page } from "@/src/lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";

import { HeaderDefinition, initRequest } from "./service-request";
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

export async function uploadBrandLogo(brandUuid: string, multipartFormData: FormData): Promise<string> {

  const metadata: String =  `/v1/brands/${brandUuid}/logo`;
  const postURI: String = `/v1/files/images/upload`;
  const header: HeaderDefinition = { name: "Content-Type", value: "multipart/form-data"};
  const request = initRequest({}, [header]);
  
  multipartFormData.append("metadata", metadata.valueOf());

  let response = await axiosInstance.post(postURI.valueOf(), multipartFormData, request);

  return response.data;
}



