import { getRequestContext } from "@/app/lib/http/requestContext";
import { createCoach, fetchCoachs } from "@/app/lib/ssr/coachs-data-service";
import { Coach } from "@/src/lib/entities/coach";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { brandId: string, gymId: string} }) {

  try {
    const { searchParams } = new URL(req.url);

    const requestContext = getRequestContext(req);

    const page: number = parseInt(searchParams.get("page") ?? "0");
    const pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    const includeInactive: boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false);

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const coachsPage = await fetchCoachs(requestContext, params.brandId, params.gymId, page, pageSize, includeInactive);

    return NextResponse.json(coachsPage, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { brandId: string, gymId: string} }) {

  try {
    let coach: Coach = await req.json();

    const requestContext = getRequestContext(req);

    coach = await createCoach(requestContext, params.brandId, params.gymId, coach);

    return NextResponse.json(coach, { status: 200 });

  } catch (err) {

    return NextResponse.json({ body: err }, { status: 400 });
  }
}