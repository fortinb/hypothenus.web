"use server"

import { Course } from "@/src//lib/entities/course";
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

export async function fetchCourses(requestContext: RequestContext, gymId: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Course>> {

  const listURI: String = `/v1/admin/gyms/${gymId}/courses`;

  const request = initRequest(requestContext, {
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);

  return response.data;
}

export async function getCourse(requestContext: RequestContext, gymId: string, courseId: string): Promise<Course> {

  const getURI: String =  `/v1/admin/gyms/${gymId}/courses/${courseId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return response.data;
}

export async function activateCourse(requestContext: RequestContext, gymId: string, courseId: string): Promise<Course> {

  const getURI: String =  `/v1/admin/gyms/${gymId}/courses/${courseId}/activate`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(getURI.valueOf(), {}, request);

  return response.data;
}

export async function deactivateCourse(requestContext: RequestContext, gymId: string, courseId: string): Promise<Course> {

  const postURI: String = `/v1/admin/gyms/${gymId}/courses/${courseId}/deactivate`; 

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return response.data;
}

export async function deleteCourse(requestContext: RequestContext, gymId: string, courseId: string): Promise<void> {

  const deleteURI: String = `/v1/admin/gyms/${gymId}/courses/${courseId}`

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.delete(deleteURI.valueOf(), request);

  return response.data;
}

export async function createCourse(requestContext: RequestContext, gymId: string, course: Course): Promise<Course> {

  const postURI: String = `/v1/admin/gyms/${gymId}/courses`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.post(postURI.valueOf(), course, request);

  return response.data;
}

export async function updateCourse(requestContext: RequestContext, gymId: string, courseId: string, course: Course): Promise<Course> {

  const putURI: String = `/v1/admin/gyms/${gymId}/courses/${courseId}`;

  const request = initRequest(requestContext, {});

  let response = await axiosInstance.put(putURI.valueOf(), course, request);

  return response.data;
}