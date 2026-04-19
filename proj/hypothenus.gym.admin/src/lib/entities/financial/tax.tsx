import { Currency } from "./currency";

export interface Tax {
    description: string;
    amount: number;
    currency: Currency;
}

export const parseTax = (data: any): Tax => {
    let tax: Tax = {
        ...data
    };

    return tax;
}

export const serializeTax = (tax: Tax): any => {
    return {
        ...tax,
    };
}
