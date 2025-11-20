import { getRequestContext } from "@/app/lib/http/requestContext";
import { deleteCoach, getCoach, updateCoach } from "@/app/lib/ssr/coachs-data-service";
import { Coach } from "@/src/lib/entities/coach";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { gymId: string,  coachId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const coach = await getCoach(requestContext, params.gymId, params.coachId);

    return NextResponse.json(coach, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { gymId: string,  coachId: string } }) {

  let coach: Coach = await req.json();
  try {

    const requestContext = getRequestContext(req);

    coach = await updateCoach(requestContext, params.gymId, params.coachId, coach);

    return NextResponse.json(coach, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { gymId: string,  coachId: string } }) {

  try {

    const requestContext = getRequestContext(req);

    await deleteCoach(requestContext, params.gymId, params.coachId);

    return NextResponse.json({ status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}