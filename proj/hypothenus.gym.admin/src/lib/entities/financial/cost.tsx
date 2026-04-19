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

export const CostSchema = z.object({
  amount: z.coerce.number( { error: "validation.numericValue" }).min(1, { error: "cost.validation.amountRequired" }).max(1000000, { error: "cost.validation.amountTooLarge" })
});
