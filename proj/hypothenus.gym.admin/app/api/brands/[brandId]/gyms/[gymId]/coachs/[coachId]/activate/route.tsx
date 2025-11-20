import { getRequestContext } from "@/app/lib/http/requestContext";
import { activateCoach } from "@/app/lib/ssr/coachs-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { gymId: string,  coachId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const gym = await activateCoach(requestContext, params.gymId, params.coachId);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

