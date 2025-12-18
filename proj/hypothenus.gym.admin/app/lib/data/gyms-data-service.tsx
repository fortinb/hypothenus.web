"use client"

import { Gym } from "@/src//lib/entities/gym";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor";

function initRequest(params: any): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.NEXT_PUBLIC_HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: params
  }

  return request;
}

export async function fetchGyms(brandId: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Gym>> {

  const listURI: String = `/v1/brands/${brandId}/gyms`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function searchGyms(brandId: string, page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<Page<Gym>> {

  const searchURI: String = `/v1/brands/${brandId}/gyms/search`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    criteria: criteria,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(searchURI.valueOf(), request);

  return response.data;
}

export async function getGym(brandId: string, gymId: string): Promise<Gym> {

  const getURI: String = `/v1/brands/${brandId}/gyms/${gymId}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function postActivateGym(brandId: string, gymId: string): Promise<Gym> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function postDeactivateGym(brandId: string, gymId: string): Promise<Gym> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function delGym(brandId: string, gymId: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandId}/gyms/${gymId}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postGym(brandId: string,gym: Gym): Promise<Gym> {

  const postURI: String = `/v1/brands/${brandId}/gyms`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), gym, request);

  return response.data;
}

export async function putGym(brandId: string, gym: Gym): Promise<Gym> {

  const putURI: String = `/v1/brands/${brandId}/gyms/${gym.gymId}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), gym, request);

  return response.data;
}