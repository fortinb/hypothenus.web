import { MembershipPlan, parseMembershipPlan, serializeMembershipPlan } from "@/src/lib/entities/membership-plan";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "@/app/lib/http/axiosInterceptor";

function initRequest(params: any): AxiosRequestConfig {

  let request: AxiosRequestConfig =
  {
    baseURL: process.env.NEXT_PUBLIC_HYPOTHENUS_ADMIN_MS_BASE_URL,
    params: params
  }

  return request;
}

export async function getMembershipPlan(brandUuid: string, membershipPlanUuid: string): Promise<MembershipPlan> {

  const getURI: String = `/v1/brands/${brandUuid}/membership/plans/${membershipPlanUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseMembershipPlan(response.data);
}

export async function postActivateMembershipPlan(brandUuid: string, membershipPlanUuid: string): Promise<MembershipPlan> {

  const postURI: String = `/v1/brands/${brandUuid}/membership/plans/${membershipPlanUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseMembershipPlan(response.data);
}

export async function postDeactivateMembershipPlan(brandUuid: string, membershipPlanUuid: string): Promise<MembershipPlan> {

  const postURI: String = `/v1/brands/${brandUuid}/membership/plans/${membershipPlanUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseMembershipPlan(response.data);
}

export async function delMembershipPlan(brandUuid: string, membershipPlanUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/membership/plans/${membershipPlanUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postMembershipPlan(membershipPlan: MembershipPlan): Promise<MembershipPlan> {

  const postURI: String = `/v1/brands/${membershipPlan.brandUuid}/membership/plans`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), serializeMembershipPlan(membershipPlan), request);

  return parseMembershipPlan(response.data);
}

export async function putMembershipPlan(membershipPlan: MembershipPlan): Promise<MembershipPlan> {

  const putURI: String = `/v1/brands/${membershipPlan.brandUuid}/membership/plans/${membershipPlan.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), serializeMembershipPlan(membershipPlan), request);

  return parseMembershipPlan(response.data);
}
