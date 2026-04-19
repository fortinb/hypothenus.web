import z from "zod";
import { FinancialInstrumentTypeEnum } from "../enum/financial-instrument-type-enum";

export interface CreditCard {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
}

export interface BankAccount {
    institution: string;
    transit: string;
    accountNumber: string;
    accountHolderName: string;
    bankName: string;
}

export interface FinancialInstrument {
    uuid: string;
    preferredInstrument: boolean;
    type: FinancialInstrumentTypeEnum;
    creditCard?: CreditCard;
    bankAccount?: BankAccount;
}

export const FinancialInstrumentSchema = z.object({
	type: z.enum(FinancialInstrumentTypeEnum, { message: "financialInstrument.validation.typeRequired" }),
	cardNumber: z.string().min(15, { message: "financialInstrument.validation.cardNumberRequired" }),
	cardHolderName: z.string().min(1, { message: "financialInstrument.validation.cardHolderNameRequired" }),
	expirationDate: z.string().min(4, { message: "financialInstrument.validation.expirationDateRequired" }),
	cvv: z.string().min(3, { message: "financialInstrument.validation.cvvRequired" }),
});

export const parseFinancialInstrument = (data: any): any => {
    let financialInstrument: FinancialInstrument = data;
    if (financialInstrument.creditCard?.expirationDate) {
        financialInstrument.creditCard.expirationDate = data.creditCard.expirationDate.format("MM/YY");
    }

    return financialInstrument;
}

export const serializeFinancialInstrument = (financialInstrument: FinancialInstrument): any => {
    return { 
        ...financialInstrument,
        creditCard: {
            ...financialInstrument.creditCard,
            expirationDate: financialInstrument.creditCard?.expirationDate ? financialInstrument.creditCard.expirationDate.replace("/", "") : ""
        }
 };
}