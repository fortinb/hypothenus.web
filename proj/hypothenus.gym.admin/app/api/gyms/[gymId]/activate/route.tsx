import { activateGym } from "@/app/lib/ssr/gyms-data-service"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { gymId: string } }) {
  
  try {
    let token = req.headers.get("Authorization");
    let trackingNumber = req.headers.get("x-tracking-number");

    const gym = await activateGym(token ?? "", trackingNumber ?? "", params.gymId);

    return NextResponse.json(gym, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

