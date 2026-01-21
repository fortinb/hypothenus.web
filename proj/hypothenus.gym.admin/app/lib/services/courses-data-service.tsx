import { Course, parseCourse } from "@/src//lib/entities/course";
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

export async function getCourse(brandUuid: string, gymUuid: string, courseUuid: string): Promise<Course> {

  const getURI: String =  `/v1/brands/${brandUuid}/gyms/${gymUuid}/courses/${courseUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseCourse(response.data);
}

export async function postActivateCourse(brandUuid: string, gymUuid: string, courseUuid: string): Promise<Course> {

  const postURI: String =  `/v1/brands/${brandUuid}/gyms/${gymUuid}/courses/${courseUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseCourse(response.data);
}

export async function postDeactivateCourse(brandUuid: string, gymUuid: string, courseUuid: string): Promise<Course> {

  const postURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/courses/${courseUuid}/deactivate`; 

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

 return parseCourse(response.data);
}

export async function delCourse(brandUuid: string, gymUuid: string, courseUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/courses/${courseUuid}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postCourse(course: Course): Promise<Course> {

  const postURI: String = `/v1/brands/${course.brandUuid}/gyms/${course.gymUuid}/courses`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), course, request);

  return parseCourse(response.data);
}

export async function putCourse(course: Course): Promise<Course> {

  const putURI: String = `/v1/brands/${course.brandUuid}/gyms/${course.gymUuid}/courses/${course.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), course, request);

  return parseCourse(response.data);
}