
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { Order, parseOrder, serializeOrder } from "@/src/lib/entities/financial/order";
import { initRequest } from "./service-request";
import { Cart, serializeCart } from "@/src/lib/entities/cart/cart";


export async function getOrder(brandUuid: string, orderUuid: string): Promise<Order> {

  const getURI: String = `/v1/brands/${brandUuid}/orders/${orderUuid}`;

  const request = initRequest({});

  let response = await axiosInstance.get(getURI.valueOf(), request);

  return parseOrder(response.data);
}

export async function postOrder(brandUuid: string, cart: Cart): Promise<Order> {

  const postUri: string = `/v1/brands/${brandUuid}/orders`;

  const request = initRequest({});

  let response = await axiosInstance.post(postUri.valueOf(), serializeCart(cart), request);

  return parseOrder(response.data);
}

export async function submitOrder(brandUuid: string, orderUuid: string, order: Order): Promise<Order> {

  const postUri: string = `/v1/brands/${brandUuid}/orders/${orderUuid}/submit`;

  const request = initRequest({});

  let response = await axiosInstance.post(postUri.valueOf(), serializeOrder(order), request);

  return parseOrder(response.data);
}

