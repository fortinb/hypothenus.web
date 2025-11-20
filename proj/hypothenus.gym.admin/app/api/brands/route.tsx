//import { validateRequest } from "@/app/lib/http/middleware";
import { getRequestContext } from "@/app/lib/http/requestContext";
import { createBrand, fetchBrands } from "@/app/lib/ssr/brands-data-service";
import { Brand } from "@/src/lib/entities/brand";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);

    const requestContext = getRequestContext(req);

    const page: number = parseInt(searchParams.get("page") ?? "0");
    const pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    const includeInactive: boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false);

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const brandsPage = await fetchBrands(requestContext, page, pageSize, includeInactive);

    return NextResponse.json(brandsPage, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  try {
    let brand: Brand = await req.json();

    const requestContext = getRequestContext(req);

    brand = await createBrand(requestContext, brand);

    return NextResponse.json(brand, { status: 200 });

  } catch (err) {

    return NextResponse.json({ body: err }, { status: 400 });
  }
}