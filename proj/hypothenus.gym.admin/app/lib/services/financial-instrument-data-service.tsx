import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { FinancialInstrument, parseFinancialInstrument, serializeFinancialInstrument } from "@/src/lib/entities/finance/financial-instrument";
import { Page } from "@/src/lib/entities/paging/page";
import { initRequest } from "./service-request";


export async function fetchFinancialInstrument(brandUuid: string, memberUuid: string, page: number, pageSize: number): Promise<Page<FinancialInstrument>> {

    const listURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/financial/instruments`;

    const request = initRequest({
        page: page,
        pageSize: pageSize,
        includeInactive: false
    });

    let response = await axiosInstance.get(listURI.valueOf(), request);
    let responsePage: Page<FinancialInstrument> = response.data;
    responsePage.content = responsePage.content.map((financialInstrumentData: any) => parseFinancialInstrument(financialInstrumentData));
    return responsePage;
}

export async function postFinancialInstrument(brandUuid: string, memberUuid: string, financialInstrument: FinancialInstrument): Promise<FinancialInstrument> {

    const postUri: string = `/v1/brands/${brandUuid}/members/${memberUuid}/financial/instruments`;

    const request = initRequest({});

    let response = await axiosInstance.post(postUri.valueOf(), serializeFinancialInstrument(financialInstrument), request);

    return parseFinancialInstrument(response.data);
}

export async function postActivateFinancialInstrument(brandUuid: string, memberUuid: string, financialInstrumentUuid: string): Promise<FinancialInstrument> {

  const postURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/financialInstruments/${financialInstrumentUuid}/activate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseFinancialInstrument(response.data);
}

export async function postDeactivateFinancialInstrument(brandUuid: string, memberUuid: string, financialInstrumentUuid: string): Promise<FinancialInstrument> {

  const postURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/financialInstruments/${financialInstrumentUuid}/deactivate`;

  const request = initRequest({});

  let response = await axiosInstance.post(postURI.valueOf(), {}, request);

  return parseFinancialInstrument(response.data);
}

export async function delFinancialInstrument(brandUuid: string, memberUuid: string,  financialInstrumentUuid: string): Promise<void> {

  const delURI: String = `/v1/brands/${brandUuid}/members/${memberUuid}/financialInstruments/${financialInstrumentUuid}`

  const request = initRequest({});

  let response = await axiosInstance.delete(delURI.valueOf(), request);

  return response.data;
}
