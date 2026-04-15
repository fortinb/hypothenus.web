import { z } from "zod";
import { OrderStatusEnum } from "../enum/order-status-enum";
import moment from "moment";
import { Cost } from "../pricing/cost";
import { Tax } from "../pricing/tax";
import { parsePaymentOption, PaymentOption, serializePaymentOption } from "../payment-option";
import { Address } from "node:cluster";
import { MembershipPlan } from "../membership-plan";

export interface OrderItem {
	membershipPlan: MembershipPlan;
	quantity: number;
	itemTotal: Cost;
}

export interface Order {
	uuid: string;
	brandUuid: string;
	memberUuid: string;
	billingAddress: Address;
	billingEmail: string;
	billingName: string;
	number: string;
	status: OrderStatusEnum;
	items: OrderItem[];
	paymentOption: PaymentOption;
	taxes: Tax[];
	subTotal: Cost;
	total: Cost;
	createdOn?: any;
}

export const parseOrder = (data: any): Order => {
	let order: Order = data;

	if (data.createdOn) {
		order.createdOn = moment(data.createdOn).toDate().toISOString();
	}
	if (data.paymentOption) {
		order.paymentOption = parsePaymentOption(data.paymentOption);
	}
	return order;
}

export const serializeOrder = (order: Order): any => {
	return { 
		...order, 
		paymentOption: serializePaymentOption(order.paymentOption) 
	};
}

export const OrderSchema = z.object({
	paymentOptionUuid: z.string().min(1, { message: "checkout.validation.paymentOptionRequired" }),
	expirationDate: z.string().min(4, { message: "checkout.validation.expirationDateRequired" }),
	cvv: z.string().min(3, { message: "checkout.validation.cvvRequired" }),
});


