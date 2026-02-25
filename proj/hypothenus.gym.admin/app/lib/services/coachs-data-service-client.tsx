"use client"

import { Coach } from "@/src//lib/entities/coach";
import { Page } from "@/src//lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { HeaderDefinition, initRequest } from "./service-request";
import { ActionResult,} from "@/app/lib/http/result";
import { failure, success } from "@/app/lib/http/handle-result-client";

export async function fetchCoachs(brandUuid: string, gymUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<ActionResult<Page<Coach>>> {

  const listURI: String = `/v1/brands/${brandUuid}/gyms/${gymUuid}/coachs`;

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

export async function uploadCoachPhoto(brandUuid: string, gymUuid: string, coachUuid: string, multipartFormData: FormData): Promise<ActionResult<string>> {

  const metadata: String =  `/v1/brands/${brandUuid}/gyms/${gymUuid}/coachs/${coachUuid}/photo`;
  const postURI: String = `/v1/files/images/upload`;
  const header: HeaderDefinition = { name: "Content-Type", value: "multipart/form-data"};
  const request = initRequest({}, [header]);

  multipartFormData.append("metadata", metadata.valueOf());

  try {
    let response = await axiosInstance.post(postURI.valueOf(), multipartFormData, request);
    return success(response.data);
  } catch (error: any) {
    return failure(error);
  }
}

