import { Member, parseMember } from "@/src//lib/entities/member";
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

export async function getMember(brandUuid: string, memberUuid: string): Promise<Member> {

  const getURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

 return parseMember(response.data);
}

export async function postActivateMember(brandUuid: string, memberUuid: string): Promise<Member> {

  const postURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseMember(response.data);
}

export async function postDeactivateMember(brandUuid: string, memberUuid: string): Promise<Member> {

  const postURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

 return parseMember(response.data);
}

export async function delMember(brandUuid: string, memberUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postMember(member: Member): Promise<Member> {

  const postURI: String = `/v1/brands/${member.brandUuid}/members/register`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), member, request);

  return parseMember(response.data);
}

export async function putMember(member: Member): Promise<Member> {

  const putURI: String = `/v1/brands/${member.brandUuid}/members/${member.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), member, request);

 return parseMember(response.data);
}