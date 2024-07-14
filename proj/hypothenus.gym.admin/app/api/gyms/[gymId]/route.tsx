import { getRequestContext } from "@/app/lib/http/requestContext";
import { deleteGym, getGym, saveGym } from "@/app/lib/ssr/gyms-data-service";
import { Gym } from "@/src/lib/entities/gym";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { gymId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const gym = await getGym(requestContext, params.gymId);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { gymId: string } }) {

  let gym: Gym = await req.json();
  try {

    const requestContext = getRequestContext(req);

    gym = await saveGym(requestContext, gym);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { gymId: string } }) {

  try {

    const requestContext = getRequestContext(req);

    await deleteGym(requestContext, params.gymId);

    return NextResponse.json({ status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}