"use client"

import { Course, parseCourse } from "@/src//lib/entities/course";
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

export async function fetchCourses(brandId: string, gymId: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Course>> {

  const listURI: String = `/v1/brands/${brandId}/gyms/${gymId}/courses`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

