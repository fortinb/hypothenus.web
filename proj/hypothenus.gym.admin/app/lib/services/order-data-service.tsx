
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { Order, parseOrder, serializeOrder } from "@/src/lib/entities/sale/order";
import { initRequest } from "./service-request";


export async function getOrder(brandUuid: string, memberUuid: string, orderUuid: string): Promise<Order> {

  const getURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/orders/${orderUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseOrder(response.data);
}

export async function postOrder(brandUuid: string, memberUuid: string, order: Order): Promise<Order> {

  const postUri: string = `/v1/brands/${brandUuid}/members/${memberUuid}/orders`;

  const request = initRequest({});

  let response = await axiosInstance.post(postUri.valueOf(), serializeOrder(order), request);

  return parseOrder(response.data);
}

export async function patchOrder(order: Order): Promise<Order> {

  const patchURI: String = `/v1/brands/${order.brandUuid}/members/${order.memberUuid}/orders/${order.uuid}`;

  const request = initRequest({});

  let response = await axiosInstance.patch(patchURI.valueOf(), serializeOrder(order), request);

  return parseOrder(response.data);
}

export async function submitOrder(brandUuid: string, memberUuid: string, orderUuid: string, order: Order): Promise<Order> {

  const postUri: string = `/v1/brands/${brandUuid}/members/${memberUuid}/orders/${orderUuid}/submit`;

  const request = initRequest({});

  let response = await axiosInstance.post(postUri.valueOf(), serializeOrder(order), request);

  return parseOrder(response.data);
}

