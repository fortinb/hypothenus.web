import { z } from "zod";
import { OrderStatusEnum } from "../enum/order-status-enum";
import moment from "moment";
import { Cost } from "./cost";
import { Tax } from "./tax";
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
	financialInstrumentUuid: string;
	taxes: Tax[];
	subTotal: Cost;
	total: Cost;
	createdOn?: any;
	submittedOn?: any;
}

export const parseOrder = (data: any): Order => {
	let order: Order = data;

	if (data.createdOn) {
		order.createdOn = moment(data.createdOn).toDate().toISOString();
	}
	if (data.submittedOn) {
		order.submittedOn = moment(data.submittedOn).toDate().toISOString();
	}
	/*if (data.financialInstrument) {
		order.financialInstrument = parseFinancialInstrument(data.financialInstrument);
	}*/
	return order;
}

export const serializeOrder = (order: Order): any => {
	return { 
		...order
	};
}

export const OrderSchema = z.object({
	financialInstrumentUuid: z.string().min(1, { message: "validation.financialInstrumentRequired" }),
/*	expirationDate: z.string().min(4, { message: "validation.expirationDateRequired" }),
	cvv: z.string().min(3, { message: "validation.cvvRequired" }),*/
});


