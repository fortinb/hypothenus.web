import { getRequestContext } from "@/app/lib/http/requestContext";
import { deleteBrand, getBrand, updateBrand } from "@/app/lib/ssr/brands-data-service";
import { Brand } from "@/src/lib/entities/brand";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { brandId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const brand = await getBrand(requestContext, params.brandId);

    return NextResponse.json(brand, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { brandId: string } }) {

  let brand: Brand = await req.json();
  try {

    const requestContext = getRequestContext(req);

    brand = await updateBrand(requestContext, brand);

    return NextResponse.json(brand, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { brandId: string } }) {

  try {

    const requestContext = getRequestContext(req);

    await deleteBrand(requestContext, params.brandId);

    return NextResponse.json({ status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}