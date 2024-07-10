import { getGym, saveGym } from '@/app/lib/ssr/gyms-data-service'
import { Gym } from '@/src/lib/entities/gym';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { gymId: string } }) {

  try {
    let token = req.headers.get("Authorization");
    let trackingNumber = req.headers.get("x-tracking-number");

    const gym = await getGym(token ?? "", trackingNumber ?? "", params.gymId);

    return NextResponse.json(gym, { status: 200 });
    
  } catch (err) {
    console.log("GET error: " + err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { gymId: string } }) {

  let gym : Gym  = await req.json();
  try {
  
    let token = req.headers.get("Authorization");
    let trackingNumber = req.headers.get("x-tracking-number");

    gym = await saveGym(token ?? "", trackingNumber ?? "", gym);
   
    return NextResponse.json(gym, { status: 200 });
    
  } catch (err) {
    console.log("PUT error: " + err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
    
}