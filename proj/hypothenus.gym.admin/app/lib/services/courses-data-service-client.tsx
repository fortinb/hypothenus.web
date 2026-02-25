"use client"

import { Course, parseCourse } from "@/src//lib/entities/course";
import { Page } from "@/src//lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { initRequest } from "./service-request";
import { ActionResult,} from "@/app/lib/http/result";
import { failure, success } from "@/app/lib/http/handle-result-client";

export async function fetchCourses(brandUuid: string, gymUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<ActionResult<Page<Course>>> {

  const listURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/courses`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    includeInactive: includeInactive
  });
  
  try {
    let response = await axiosInstance.get(listURI.valueOf(), request);
    return success(response.data);
  } catch (error: any) {
    return failure(error);
  }
}