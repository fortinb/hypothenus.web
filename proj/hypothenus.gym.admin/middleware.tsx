import { NextRequest, NextResponse } from "next/server";

export interface RequestContext {
    token: string | null;
    trackingNumber: string | null;
}

export function middleware(req: NextRequest) {

    const requestContext: RequestContext = {
        token: req?.headers?.get("Authorization"),
        trackingNumber: req?.headers?.get("x-tracking-number")
    }

    if (!requestContext.token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requestContext.trackingNumber) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*']
  }