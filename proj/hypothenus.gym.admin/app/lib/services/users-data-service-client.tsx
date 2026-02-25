"use client";

import { User } from "@/src//lib/entities/user";
import { Page } from "@/src//lib/entities/page";
import axiosInstance from "@/app/lib/http/axiosInterceptor-client";
import { initRequest } from "./service-request";
import { ActionResult,} from "@/app/lib/http/result";
import { failure, success } from "@/app/lib/http/handle-result-client";

export async function fetchUsers(page: number, pageSize: number, includeInactive: boolean): Promise<ActionResult<Page<User>>> {

    const listURI: String = `/v1/users`;

    const request = initRequest({
        page: page,
        pageSize: pageSize,
        includeInactive: includeInactive
    });

    try {
        let response = await axiosInstance.get(listURI.valueOf(), request);
        return success(response.data);
    } catch (error: any) {
        return failure(error);
    }
}

export async function searchUsers(page: number, pageSize: number, includeInactive: boolean, criteria: String): Promise<ActionResult<Page<User>>> {

    const searchURI: String = `/v1/users/search`;

    const request = initRequest({
        page: page,
        pageSize: pageSize,
        criteria: criteria,
        includeInactive: includeInactive
    });

    try {
        let response = await axiosInstance.get(searchURI.valueOf(), request);
        return response.data;
    } catch (error: any) {
        return failure(error);
    }
}
