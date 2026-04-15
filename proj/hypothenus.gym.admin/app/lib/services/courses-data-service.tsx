import { Course, parseCourse, serializeCourse } from "@/src//lib/entities/course";
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { Page } from "@/src/lib/entities/page";
import { initRequest } from "./service-request";

export async function fetchCourses(brandUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<Page<Course>> {

  const listURI: String = `/v1/brands/${brandUuid}/courses`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });

  let response = await axiosInstance.get(listURI.valueOf(), request);
  let responsePage: Page<Course> = response.data;
  responsePage.content = responsePage.content.map((courseData: any) => parseCourse(courseData));
  return responsePage;
}

export async function getCourse(brandUuid: string, courseUuid: string): Promise<Course> {

  const getURI: String = `/v1/brands/${brandUuid}/courses/${courseUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseCourse(response.data);
}

export async function postActivateCourse(brandUuid: string, courseUuid: string): Promise<Course> {

  const postURI: String = `/v1/brands/${brandUuid}/courses/${courseUuid}/activate`;

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