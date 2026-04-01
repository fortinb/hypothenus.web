import { Coach, parseCoach, serializeCoach } from "@/src//lib/entities/coach";
import { Page } from "@/src//lib/entities/page";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor";


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

export async function fetchCoachs(brandUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Coach>> {

  const listURI: String = `/v1/brands/${brandUuid}/coachs`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function getCoach(brandUuid: string, coachUuid: string): Promise<Coach> {

  const getURI: String =  `/v1/brands/${brandUuid}/coachs/${coachUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseCoach(response.data);
}

export async function postActivateCoach(brandUuid: string, coachUuid: string): Promise<Coach> {

  const postURI: String =  `/v1/brands/${brandUuid}/coachs/${coachUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseCoach(response.data);
}

export async function postDeactivateCoach(brandUuid: string, coachUuid: string): Promise<Coach> {

  const postURI: String = `/v1/brands/${brandUuid}/coachs/${coachUuid}/deactivate`; 

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseCoach(response.data);
}

export async function delCoach(brandUuid: string, coachUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/coachs/${coachUuid}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postCoach(coach: Coach): Promise<Coach> {

  const postURI: String = `/v1/brands/${coach.brandUuid}/coachs`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), serializeCoach(coach), request);
 
  return parseCoach(response.data);
}

export async function putCoach(coach: Coach): Promise<Coach> {

  const putURI: String = `/v1/brands/${coach.brandUuid}/coachs/${coach.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), serializeCoach(coach), request);


  return parseCoach(response.data);
}