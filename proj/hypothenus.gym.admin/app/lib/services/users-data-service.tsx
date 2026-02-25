import { User, parseUser } from "@/src//lib/entities/user";
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

export async function getUser(userUuid: string): Promise<User> {

  const getURI: String = `/v1/users/${userUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

 return parseUser(response.data);
}

export async function postActivateUser(userUuid: string): Promise<User> {

  const postURI: String = `/v1/users/${userUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseUser(response.data);
}

export async function postDeactivateUser(userUuid: string): Promise<User> {

  const postURI: String = `/v1/users/${userUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

 return parseUser(response.data);
}

export async function delUser(userUuid: string): Promise<void> {

  const delURI: String = `/v1/users/${userUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

export async function postUser(user: User): Promise<User> {

  const postURI: String = `/v1/users/register`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), user, request);

  return parseUser(response.data);
}

export async function putUser(user: User): Promise<User> {

  const putURI: String = `/v1/users/${user.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), user, request);

 return parseUser(response.data);
}
