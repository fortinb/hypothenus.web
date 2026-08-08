import z from "zod";
import { Currency } from "./currency";

export interface Cost {
  amount: number;
  currency: Currency;
}

export const parseCost = (data: any): Cost => {
    let cost: Cost = {
        ...data
    };

    return cost;
}

export const serializeCost = (cost: Cost): any => {
    return {
        ...cost,
    };
}

export function formatCost(price: any, showCurrency: boolean = true): string {
    
    if (!price) {
        return "";
    }

    let cost = parseCost(price);
    const amount = (cost.amount / 100).toFixed(2);
    return showCurrency ? `${amount}${cost.currency.symbol} (${cost.currency.code})` : `${amount}${cost.currency.symbol}`;
}

export const CostSchema = z.object({
  amount: z.coerce.number( { error: "validation.numericValue" }).min(1, { error: "cost.validation.amountRequired" }).max(1000000, { error: "cost.validation.amountTooLarge" })
});
