//import { validateRequest } from "@/app/lib/http/middleware";
import { createGym, fetchGyms } from "@/app/lib/ssr/gyms-data-service";
import { Gym } from "@/src/lib/entities/gym";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
//  try {
    const { searchParams } = new URL(req.url);

  //  const requestContext = validateRequest(req);
    let token = req.headers.get("Authorization") ?? ""; 
    let trackingNumber = req.headers.get("x-tracking-number") ?? "";

   console.log ("pizza 2");
    let page: number = parseInt(searchParams.get("page") ?? "0") ;
    let pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    let includeInactive : boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false) ?? false;
    
    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const gymsPage = await fetchGyms(token, trackingNumber, page, pageSize, includeInactive);
   
    return NextResponse.json(gymsPage, { status: 200 });
    
 /* } catch (err) {
    console.log("GET error: " + err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
    */
}

export async function POST(req: NextRequest) {

  try {
    let gym : Gym  = await req.json();

    let token = req.headers.get("Authorization");

    let trackingNumber = req.headers.get("x-tracking-number");

    gym = await createGym(token ?? "", trackingNumber ?? "", gym);
   
    return NextResponse.json(gym, { status: 200 });
    
  } catch (err) {
    console.log("POST error: " + err);
    
    return NextResponse.json({ body: err }, { status: 400 });
  }
}