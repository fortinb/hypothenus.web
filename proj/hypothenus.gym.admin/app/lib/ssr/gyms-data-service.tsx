"use server"

import { Gym } from "@/src//lib/entities/gym";
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

export async function fetchGyms(requestContext: RequestContext, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Gym>> {

  const listURI: String = "/v1/admin/gyms";

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function searchGyms(requestContext: RequestContext, page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<Page<Gym>> {

  const searchURI: String = "/v1/admin/gyms/search";

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    criteria: criteria,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(searchURI.valueOf(), request);

  return response.data;
}

export async function getGym(requestContext: RequestContext, gymId: string): Promise<Gym> {

  const getURI: String = `/v1/admin/gyms/${gymId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function activateGym(requestContext: RequestContext, gymId: string): Promise<Gym> {

  const getURI: String = `/v1/admin/gyms/${gymId}/activate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(getURI.valueOf(), {}, request);

  return response.data;
}

export async function deactivateGym(requestContext: RequestContext, gymId: string): Promise<Gym> {

  const postURI: String = `/v1/admin/gyms/${gymId}/deactivate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function deleteGym(requestContext: RequestContext, gymId: string): Promise<void> {

  const deleteURI: String = `/v1/admin/gyms/${gymId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.delete(deleteURI.valueOf(), request);

  return response.data;
}

export async function createGym(requestContext: RequestContext, gym: Gym): Promise<Gym> {

  const postURI: String = "/v1/admin/gyms";

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), gym, request);

  return response.data;
}

export async function updateGym(requestContext: RequestContext, gym: Gym): Promise<Gym> {

  const putURI: String = `/v1/admin/gyms/${gym.gymId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.put(putURI.valueOf(), gym, request);

  return response.data;
}