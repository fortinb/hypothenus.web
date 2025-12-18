"use client"

import { Course, parseCourse } from "@/src//lib/entities/course";
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

export async function getCourse(brandId: string, gymId: string, courseId: string): Promise<Course> {

  const getURI: String =  `/v1/brands/${brandId}/gyms/${gymId}/courses/${courseId}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseCourse(response.data);
}

export async function postActivateCourse(brandId: string, gymId: string, courseId: string): Promise<Course> {

  const postURI: String =  `/v1/brands/${brandId}/gyms/${gymId}/courses/${courseId}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function postDeactivateCourse(brandId: string, gymId: string, courseId: string): Promise<Course> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/courses/${courseId}/deactivate`; 

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function delCourse(brandId: string, gymId: string, courseId: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandId}/gyms/${gymId}/courses/${courseId}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postCourse(brandId: string, gymId: string, course: Course): Promise<Course> {

  const postURI: String = `/v1/brands/${brandId}/gyms/${gymId}/courses`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), course, request);

  return parseCourse(response.data);
}

export async function putCourse(brandId: string, gymId: string, courseId: string, course: Course): Promise<Course> {

  const putURI: String = `/v1/brands/${brandId}/gyms/${gymId}/courses/${courseId}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), course, request);

  return parseCourse(response.data);
}