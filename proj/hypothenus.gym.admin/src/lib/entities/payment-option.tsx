import z from "zod";
import { PaymentMethodEnum } from "./enum/payment-method-enum";

export interface PaymentOption {
    uuid: string;
    default: boolean;
    paymentMethod: PaymentMethodEnum;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
    token: string;
}

export const PaymentOptionSchema = z.object({
	paymentMethod: z.enum(PaymentMethodEnum, { message: "checkout.validation.paymentMethodRequired" }),
	cardNumber: z.string().min(15, { message: "checkout.validation.cardNumberRequired" }),
	cardHolderName: z.string().min(1, { message: "checkout.validation.cardHolderNameRequired" }),
	expirationDate: z.string().min(4, { message: "checkout.validation.expirationDateRequired" }),
	cvv: z.string().min(3, { message: "checkout.validation.cvvRequired" }),
});

export const parsePaymentOption = (data: any): any => {
    let paymentOption: PaymentOption = data;
    if (data.expirationDate) {
        paymentOption.expirationDate = data.expirationDate.format("MM/YY");
    }

    return paymentOption;
}

export const serializePaymentOption = (paymentOption: PaymentOption): any => {
    return { 
        ...paymentOption,
        expirationDate: paymentOption.expirationDate ? paymentOption.expirationDate.replace("/", "") : ""
 };
}