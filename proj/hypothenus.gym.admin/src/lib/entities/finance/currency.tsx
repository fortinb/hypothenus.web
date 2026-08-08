import z from "zod";

export interface Currency {
  name: string;
  code: string;
  symbol: string;
}

export const newCurrency = (): Currency => {
    let newCurrency: Currency = {
        code: process.env.DEFAULT_CURRENCY_CODE ?? "CAD",
        name: process.env.DEFAULT_CURRENCY_NAME ?? "Canadian Dollar",
        symbol: process.env.DEFAULT_CURRENCY_SYMBOL ?? "$",
    };
    return newCurrency;
}

export const CurrencySchema = z.object({
  code: z.string().min(1, { message: "currency.validation.codeRequired" }),
  name: z.string().min(1, { message: "currency.validation.nameRequired" }),
  symbol: z.string().min(1, { message: "currency.validation.symbolRequired" }),
});
