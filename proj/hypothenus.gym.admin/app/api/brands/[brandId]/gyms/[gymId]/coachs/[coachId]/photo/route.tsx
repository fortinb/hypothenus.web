import { getRequestContext } from "@/app/lib/http/requestContext";
import { uploadCoachPhoto } from "@/app/lib/ssr/coachs-data-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { brandId: string,  gymId: string,  coachId: string } }) {

  try {
    const requestContext = getRequestContext(req);
   
    let multipartFormData: FormData = await req.formData();

    const photoUri = await uploadCoachPhoto(requestContext, params.brandId, params.gymId, params.coachId, multipartFormData /*photoContent.get("file") as File*/);

    return NextResponse.json(photoUri, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

