"use client"

import { Coach } from "@/src//lib/entities/coach";
import { Page } from "@/src//lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { HeaderDefinition, initRequest } from "./service-request";


export async function fetchCoachs(brandId: string, gymId: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Coach>> {

  const listURI: String = `/v1/brands/${brandId}/gyms/${gymId}/coachs`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}


export async function uploadCoachPhoto(brandId: string, gymId: string, coachId: string, multipartFormData: FormData): Promise<string> {

  const metadata: String =  `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/photo`;
  const postURI: String = `/v1/files/images/upload`;
  const header: HeaderDefinition = { name: "Content-Type", value: "multipart/form-data"};
  const request = initRequest({}, [header]);

  multipartFormData.append("metadata", metadata.valueOf());

  let response = await axiosInstance.post(postURI.valueOf(), multipartFormData, request);

  return response.data;
}

