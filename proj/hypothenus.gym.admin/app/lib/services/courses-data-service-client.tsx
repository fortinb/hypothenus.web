"use client"

import { Course, parseCourse } from "@/src//lib/entities/course";
import { Page } from "@/src//lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { initRequest } from "./service-request";

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

