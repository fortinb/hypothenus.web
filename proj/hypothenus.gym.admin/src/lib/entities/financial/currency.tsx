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