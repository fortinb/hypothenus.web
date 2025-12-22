"use client"

import { Coach, parseCoach } from "@/src//lib/entities/coach";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";


interface HeaderDefinition {
  name: string,
  value: string
}

function initRequest(params: any, headers?: HeaderDefinition[]): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.NEXT_PUBLIC_HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: params
  }

  if (headers) {
    headers.forEach(header => {
      if (!request.headers) {
        request["headers"] = {};
      }

      request.headers[header.name] = header.value;
    })
  }
 
  return request;
}

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

  const postURI: String =  `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/photo`;

  const header: HeaderDefinition = { name: "Content-Type", value: "multipart/form-data"};
  const request = initRequest({}, [header]);

  let response = await axiosInstance.post(postURI.valueOf(), multipartFormData, request);

  return response.data;
}

export async function postActivateCoach(brandId: string, gymId: string, coachId: string): Promise<Coach> {

  const postURI: String =  `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function postDeactivateCoach(brandId: string, gymId: string, coachId: string): Promise<Coach> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/deactivate`; 

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function delCoach(brandId: string, gymId: string, coachId: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postCoach(brandId: string, gymId: string, coach: Coach): Promise<Coach> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/coachs`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), coach, request);
 
  return parseCoach(response.data);
}

export async function putCoach(brandId: string, gymId: string, coachId: string, coach: Coach): Promise<Coach> {

  const putURI: String = `/v1/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), coach, request);


  return parseCoach(response.data);
}