import { fetchGyms } from '@/app/lib/ssr/gyms-data-service'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
 
export async function POST(req: NextRequest) {

  try {
    const body  = await req.json();

    const ParamsSchema = z.object({
      pageNumber: z.number().min(0, "Invalid page number"), 
      pageSize: z.number().min(0, "Invalid page size"), 
    });
    
    const validatedParams = ParamsSchema.safeParse(body);
    if (!validatedParams.success) {
      return NextResponse.json(validatedParams?.error?.issues, { status: 400 });
    }

    let pageNumber : number = body.pageNumber;
    let pageSize : number = body.pageSize;

    let token = req.headers.get('Authorization');
    let trackingNumber = req.headers.get('x-tracking-number');

    const gymsPage = await fetchGyms(token ?? "", trackingNumber ?? "", pageNumber, pageSize);
   
    return NextResponse.json(gymsPage, { status: 200 });
    
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}