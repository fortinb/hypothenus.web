import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "./app/lib/http/requestContext";



export function middleware(req: NextRequest) {

    const requestContext = getRequestContext(req);
    
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