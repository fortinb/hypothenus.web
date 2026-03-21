import z from "zod";
import { Currency } from "./currency";

export interface Cost {
  amount: number;
  currency: Currency;
}

export const parseCost = (data: any): Cost => {
    let cost: Cost = {
        ...data,
        amount: Number.isInteger(data.amount) ? data.amount / 100 : data.amount
    };

    return cost;
}

export const serializeCost = (cost: Cost): any => {
    return {
        ...cost,
        amount: Math.round(cost.amount * 100)
    };
}

export const CostSchema = z.object({
  amount: z.coerce.number( { error: "validation.numericValue" }).min(1, { error: "cost.validation.amountRequired" })
});
