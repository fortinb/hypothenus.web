import { getRequestContext } from "@/app/lib/http/requestContext";
import { searchGyms } from "@/app/lib/ssr/gyms-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);

    const requestContext = getRequestContext(req);

    const page: number = parseInt(searchParams.get("page") ?? "0");
    const pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    const criteria: string = searchParams.get("criteria") ?? "";
    const includeInactive: boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false) ?? false;

    if (isNaN(page) || isNaN(pageSize) || criteria == "") {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const gymsPage = await searchGyms(requestContext, page, pageSize, includeInactive, criteria);

    return NextResponse.json(gymsPage, { status: 200 });

  } catch (err) {
    console.log("GET error: " + err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}