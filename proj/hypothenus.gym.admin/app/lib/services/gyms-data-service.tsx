import { Gym, parseGym } from "@/src//lib/entities/gym";
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

export async function getGym(brandUuid: string, gymUuid: string): Promise<Gym> {

  const getURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

 return parseGym(response.data);
}

export async function postActivateGym(brandUuid: string, gymUuid: string): Promise<Gym> {

  const postURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseGym(response.data);
}

export async function postDeactivateGym(brandUuid: string, gymUuid: string): Promise<Gym> {

  const postURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

 return parseGym(response.data);
}

export async function delGym(brandUuid: string, gymUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postGym(gym: Gym): Promise<Gym> {

  const postURI: String = `/v1/brands/${gym.brandUuid}/gyms`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), gym, request);

  return parseGym(response.data);
}

export async function putGym(gym: Gym): Promise<Gym> {

  const putURI: String = `/v1/brands/${gym.brandUuid}/gyms/${gym.code}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), gym, request);

 return parseGym(response.data);
}

