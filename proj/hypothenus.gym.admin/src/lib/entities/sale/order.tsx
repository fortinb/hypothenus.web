import moment from "moment";
import { z } from "zod";
import { Cart } from "../cart/cart";
import { OrderStatusEnum } from "../enum/order-status-enum";
import { PaymentMethodEnum } from "../enum/payment-method-enum";
import { ShippingMethodEnum } from "../enum/shipping-method-enum";
import { Cost } from "../finance/cost";
import { Tax } from "../finance/tax";
import { MembershipPlan } from "../membership-plan";
import { Currency } from "../finance/currency";
import { BaseEntity } from "../entity/base-entity";
import { Address, AddressSchema } from "../contact/address";

export interface OrderItem {
	membershipPlan: Partial<MembershipPlan>;
	unitPrice?: Cost;
	quantity: number;
	itemTotal?: Cost;
}

export interface ShippingDetail {
	address: Address;
	shippingMethod: ShippingMethodEnum;
	carrier?: string;
	trackingNumber?: string;
	shippedOn?: any;
	deliveredOn?: any;
}

export interface BillingDetail {
	address: Address;
	email: string;
	name: string;
}

export interface PaymentDetail {
	paymentMethod: PaymentMethodEnum;
	financialInstrumentUuid: string;
}

export interface DiscountDetail {
	couponCode: string;
	discountRate: string;
	discountAmount: Cost;
}

export interface Order extends BaseEntity {
	uuid?: any;
	brandUuid: string;
	memberUuid: string;
	billingDetail?: BillingDetail;
	currency?: Currency;
	orderNumber?: string;
	status: OrderStatusEnum;
	items: OrderItem[];
	shippingDetail?: ShippingDetail;
	discountDetail?: DiscountDetail;
	paymentDetail?: PaymentDetail;
	deposit?: Cost;
	subTotal?: Cost;
	taxes?: Tax[];
	shippingTotal?: Cost;
	discountTotal?: Cost;
	total?: Cost;
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
	return order;
}

export const serializeOrder = (order: Order): any => {
	return {
		...order
	};
}

export const mapCartToOrder = (cart: Cart): Order => {
	return {
		uuid: cart.orderUuid,
		brandUuid: cart.brandUuid,
		memberUuid: cart.memberUuid,
		billingDetail: undefined,
		orderNumber: undefined,
		currency: undefined,
		status: OrderStatusEnum.idle,
		items: cart.items.map(item => {
			return {
				membershipPlan: {
					uuid: item.membershipPlan.uuid
				} as MembershipPlan,
				unitPrice: undefined,
				quantity: item.quantity ?? 1,
				itemTotal: undefined,
			} as OrderItem;
		}),
		shippingDetail: undefined,
		discountDetail: undefined,
		paymentDetail: undefined,
		deposit: undefined,
		subTotal: undefined,
		taxes: [] as Tax[],
		shippingTotal: undefined,
		discountTotal: undefined,
		total: undefined,
		createdOn: undefined,
		submittedOn: undefined,
        messages: [],
        createdBy: undefined,
        modifiedBy: undefined,
	};
}

export const BillingDetailSchema = z.object({
	address: AddressSchema,
	email: z.email("billingDetail.validation.emailInvalid"),
	name: z.string().min(1, { message: "billingDetail.validation.nameRequired" }),
});

export const ShippingDetailSchema = z.object({
	address: AddressSchema,
	shippingMethod: z.enum(ShippingMethodEnum).optional(),
});

export const PaymentDetailSchema = z.object({
	financialInstrumentUuid: z.string().min(1, { message: "paymentDetail.validation.financialInstrumentRequired" }),
});

export const OrderSchema = z.object({
	billingDetail: BillingDetailSchema,
	shippingDetail: ShippingDetailSchema.optional(),
	paymentDetail: PaymentDetailSchema
});


