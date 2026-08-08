import { FinancialInstrument } from "../finance/financial-instrument";

export interface FinancialInstrumentSelectedItem {
    financialInstrument: FinancialInstrument;
    label: string;
    value: string;
}