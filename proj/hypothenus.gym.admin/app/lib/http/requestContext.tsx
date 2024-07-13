import { NextRequest } from "next/server";

export interface RequestContext {
    token: string;
    trackingNumber: string;
}

export function getRequestContext(req: NextRequest): RequestContext {

    const requestContext: RequestContext = {
        token: req?.headers?.get("Authorization") ?? "invalid",
        trackingNumber: req?.headers?.get("x-tracking-number") ?? "none"
    }

    return requestContext;
}