import { Course, parseCourse, serializeCourse } from "@/src//lib/entities/course";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { Page } from "@/src/lib/entities/page";


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

export async function fetchCourses(brandUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Course>> {

  const listURI: String = `/v1/brands/${brandUuid}/courses`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

    let response = await axiosInstance.get(listURI.valueOf(), request);
    return response.data;
}

export async function getCourse(brandUuid: string, courseUuid: string): Promise<Course> {

  const getURI: String =  `/v1/brands/${brandUuid}/courses/${courseUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseCourse(response.data);
}

export async function postActivateCourse(brandUuid: string, courseUuid: string): Promise<Course> {

  const postURI: String =  `/v1/brands/${brandUuid}/courses/${courseUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseCourse(response.data);
}

export async function postDeactivateCourse(brandUuid: string, courseUuid: string): Promise<Course> {

  const postURI: String = `/v1/brands/${brandUuid}/courses/${courseUuid}/deactivate`; 

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

 return parseCourse(response.data);
}

export async function delCourse(brandUuid: string, courseUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/courses/${courseUuid}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postCourse(course: Course): Promise<Course> {

  const postURI: String = `/v1/brands/${course.brandUuid}/courses`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), serializeCourse(course), request);

  return parseCourse(response.data);
}

export async function putCourse(course: Course): Promise<Course> {

  const putURI: String = `/v1/brands/${course.brandUuid}/courses/${course.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), serializeCourse(course), request);

  return parseCourse(response.data);
}