import { getRequestContext } from "@/app/lib/http/requestContext";
import { deactivateGym } from "@/app/lib/ssr/gyms-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { brandId: string; gymId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const gym = await deactivateGym(requestContext, params.brandId, params.gymId);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

