import z from "zod";
import { FinancialInstrumentTypeEnum } from "../enum/financial-instrument-type-enum";
import { zipCodeRegex } from "../contact/address";

export interface CreditCard {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvd: string;
    zipCode: string;
}

export interface BankAccount {
    institution: string;
    transit: string;
    accountNumber: string;
    accountHolderName: string;
    bankName: string;
}

export interface FinancialInstrument {
    brandUuid: string,
    memberUuid: string;
    uuid: string;
    preferredInstrument: boolean;
    type: FinancialInstrumentTypeEnum;
    creditCard?: CreditCard;
    bankAccount?: BankAccount;
}

export const FinancialInstrumentCreditCardSchema = z.object({
    cardNumber: z.string().min(15, { message: "financialInstrument.validation.cardNumberRequired" }),
    cardHolderName: z.string().min(1, { message: "financialInstrument.validation.cardHolderNameRequired" }),
    expirationDate: z.string()
        .min(4, { message: "financialInstrument.validation.expirationDateRequired" })
        .refine((val) => {
            const month = parseInt(val.substring(0, 2), 10);
            return !isNaN(month) && month >= 1 && month <= 12;
        }, { message: "financialInstrument.validation.expirationDateInvalidMonth" }),
    cvd: z.string().min(3, { message: "financialInstrument.validation.cvdRequired" }),
    zipCode: z.string().regex(zipCodeRegex, { message: "address.validation.zipcodeFormat" }),
});

export const parseFinancialInstrument = (data: any): any => {
    let financialInstrument: FinancialInstrument = data;
    if (financialInstrument.creditCard?.expirationDate) {
       financialInstrument.creditCard.expirationDate = formatExpirationDate(data.creditCard.expirationDate);
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

export const newCreditCard = (): CreditCard => {
    let newCreditCard: CreditCard = {
        cardNumber: "",
        cardHolderName: "",
        expirationDate: "",
        cvd: "",
        zipCode: ""
    };

    return newCreditCard;
}

export const newBankAccount = (): BankAccount => {
    let newBankAccount: BankAccount = {
        institution: "",
        transit: "",
        accountNumber: "",
        accountHolderName: "",
        bankName: ""
    };

    return newBankAccount;
}

export const newFinancialInstrument = (brandUuid: string, memberUuid: string, type: FinancialInstrumentTypeEnum): FinancialInstrument => {
    let newFinancialInstrument: FinancialInstrument = {
        brandUuid: brandUuid,
        memberUuid: memberUuid,
        uuid: "",
        preferredInstrument: false,
        type: type
    };

    if (type === FinancialInstrumentTypeEnum.creditCard) {
        newFinancialInstrument.bankAccount = undefined;
        newFinancialInstrument.creditCard = newCreditCard();
    } else if (type === FinancialInstrumentTypeEnum.bankAccount) {
        newFinancialInstrument.creditCard = undefined;
        newFinancialInstrument.bankAccount = newBankAccount();
    }
    return newFinancialInstrument;
}

export function formatExpirationDate(expirationDate: string): string {
  if (!expirationDate) {
    return "";
  }

  if (expirationDate.length == 5 && expirationDate.charAt(2) === "/") {
    return expirationDate;
  }

  if (expirationDate.length !== 4) {
    return expirationDate;
  }

  const month = expirationDate.substring(0, 2);
  const year = expirationDate.substring(2, 4);

  return `${month}/${year}`;
}