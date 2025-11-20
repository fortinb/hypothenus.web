"use server"

import { Coach } from "@/src//lib/entities/coach";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../http/axiosInterceptor";
import { RequestContext } from "../http/requestContext";

interface HeaderDefinition {
  name: string,
  value: string
}
function initRequest(requestContext: RequestContext, params: any, headers?: HeaderDefinition[]): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.HYPOTHENUS_ADMIN_MS_BASE_URL,
    headers: {
      "authorization": requestContext.token,
      "x-tracking-number": requestContext.trackingNumber
    },
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

export async function fetchCoachs(requestContext: RequestContext, gymId: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Coach>> {

  const listURI: String = `/v1/gyms/${gymId}/coachs`;

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function getCoach(requestContext: RequestContext, gymId: string, coachId: string): Promise<Coach> {

  const getURI: String =  `/v1/gyms/${gymId}/coachs/${coachId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function uploadCoachPhoto(requestContext: RequestContext, gymId: string, coachId: string, multipartFormData: FormData): Promise<string> {

  const getURI: String =  `/v1/gyms/${gymId}/coachs/${coachId}/photo`;

  const header: HeaderDefinition = { name: "Content-Type", value: "multipart/form-data"};
  const request = initRequest(requestContext, {}, [header]);

  let response = await axiosInstance.post(getURI.valueOf(), multipartFormData, request);

  return response.data;
}

export async function activateCoach(requestContext: RequestContext, gymId: string, coachId: string): Promise<Coach> {

  const getURI: String =  `/v1/gyms/${gymId}/coachs/${coachId}/activate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(getURI.valueOf(), {}, request);

  return response.data;
}

export async function deactivateCoach(requestContext: RequestContext, gymId: string, coachId: string): Promise<Coach> {

  const postURI: String = `/v1/gyms/${gymId}/coachs/${coachId}/deactivate`; 

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function deleteCoach(requestContext: RequestContext, gymId: string, coachId: string): Promise<void> {

  const deleteURI: String = `/v1/gyms/${gymId}/coachs/${coachId}`

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.delete(deleteURI.valueOf(), request);

  return response.data;
}

export async function createCoach(requestContext: RequestContext, gymId: string, coach: Coach): Promise<Coach> {

  const postURI: String = `/v1/gyms/${gymId}/coachs`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), coach, request);

  return response.data;
}

export async function updateCoach(requestContext: RequestContext, gymId: string, coachId: string, coach: Coach): Promise<Coach> {

  const putURI: String = `/v1/gyms/${gymId}/coachs/${coachId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.put(putURI.valueOf(), coach, request);

  return response.data;
}