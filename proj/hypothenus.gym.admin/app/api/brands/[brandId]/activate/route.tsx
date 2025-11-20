import { getRequestContext } from "@/app/lib/http/requestContext";
import { activateBrand } from "@/app/lib/ssr/brands-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { brandId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const brand = await activateBrand(requestContext, params.brandId);

    return NextResponse.json(brand, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

