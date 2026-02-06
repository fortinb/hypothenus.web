import { Brand, parseBrand } from "@/src/lib/entities/brand";
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

export async function getBrand(brandUuid: string): Promise<Brand> {

  const getURI: String = `/v1/brands/${brandUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseBrand(response.data);
}


export async function getBrandByCode(brandCode: string): Promise<Brand> {

  const getURI: String = `/v1/brands/code/${brandCode}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseBrand(response.data);
}

export async function postBrand(brand: Brand): Promise<Brand> {

  const postURI: String = "/v1/brands";

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), brand, request);

  return parseBrand(response.data);
}

export async function putBrand(brand: Brand): Promise<Brand> {

  const putURI: String = `/v1/brands/${brand.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.put(putURI.valueOf(), brand, request);

  return parseBrand(response.data);
}

export async function postActivateBrand(brandUuid: string): Promise<Brand> {

  const postURI: String = `/v1/brands/${brandUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseBrand(response.data);
}

export async function postDeactivateBrand(brandUuid: string): Promise<Brand> {

  const postURI: String = `/v1/brands/${brandUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseBrand(response.data);
}

export async function delBrand(brandUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}

function findInvalidValue(
  value: any,
  path = "root"
): string | null {
  if (value === undefined) {
    return `${path} is undefined`;
  }

  if (
    typeof value === "bigint" ||
    typeof value === "symbol" ||
    typeof value === "function"
  ) {
    return `${path} has invalid type: ${typeof value}`;
  }

  if (value instanceof Date) {
    return `${path} is Date`;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const r = findInvalidValue(value[i], `${path}[${i}]`);
      if (r) return r;
    }
    return null;
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const r = findInvalidValue(value[key], `${path}.${key}`);
      if (r) return r;
    }
  }

  return null;
}
