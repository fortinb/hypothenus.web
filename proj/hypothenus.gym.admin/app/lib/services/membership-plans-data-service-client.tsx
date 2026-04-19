"use client";

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Page } from "@/src/lib/entities/paging/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { initRequest } from "./service-request";
import { ActionResult } from "@/app/lib/http/result";
import { failure, success } from "@/app/lib/http/handle-result-client";

export async function fetchMembershipPlans(brandUuid: string, page: number, pageSize: number, includeInactive: boolean): Promise<ActionResult<Page<MembershipPlan>>> {

  const listURI: String = `/v1/brands/${brandUuid}/membership/plans`;

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

export async function searchMembershipPlans(brandUuid: string, page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<ActionResult<Page<MembershipPlan>>> {

  const searchURI: String = `/v1/brands/${brandUuid}/membership/plans/search`;

  const request = initRequest({
    page: page,
    pageSize: pageSize,
    criteria: criteria,
    includeInactive: includeInactive
  });

  try {
    let response = await axiosInstance.get(searchURI.valueOf(), request);
    return success(response.data);
  } catch (error: any) {
    return failure(error);
  }
}
