//import { validateRequest } from "@/app/lib/http/middleware";
import { getRequestContext } from "@/app/lib/http/requestContext";
import { createGym, fetchGyms } from "@/app/lib/ssr/gyms-data-service";
import { Gym } from "@/src/lib/entities/gym";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);

    const requestContext = getRequestContext(req);

    const page: number = parseInt(searchParams.get("page") ?? "0");
    const pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    const includeInactive: boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false) ?? false;

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const gymsPage = await fetchGyms(requestContext, page, pageSize, includeInactive);

    return NextResponse.json(gymsPage, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  try {
    let gym: Gym = await req.json();

    const requestContext = getRequestContext(req);

    gym = await createGym(requestContext, gym);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    console.log("POST error: " + err);

    return NextResponse.json({ body: err }, { status: 400 });
  }
}