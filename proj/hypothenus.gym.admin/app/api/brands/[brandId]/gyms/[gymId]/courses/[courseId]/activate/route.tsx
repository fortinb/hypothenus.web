import { getRequestContext } from "@/app/lib/http/requestContext";
import { activateCourse } from "@/app/lib/ssr/courses-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { brandId: string, gymId: string,  courseId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const gym = await activateCourse(requestContext, params.brandId, params.gymId, params.courseId);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

