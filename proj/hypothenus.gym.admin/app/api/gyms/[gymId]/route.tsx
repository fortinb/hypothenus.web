import { getGym } from '@/app/lib/ssr/gyms-data-service'
import { NextRequest, NextResponse } from 'next/server';
//import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: { gymId: string } }) {

  try {
    let token = req.headers.get('Authorization');
    let trackingNumber = req.headers.get('x-tracking-number');

    const gym = await getGym(token ?? "", trackingNumber ?? "", params.gymId);

    return NextResponse.json(gym, { status: 200 });
    
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  /*
      try {
        const body  = await req.json();
    
        const ParamsSchema = z.object({
          criteria:z.string().min(2, "Invalid search criteria"),
          pageNumber: z.number().min(0, "Invalid page number"), 
          pageSize: z.number().min(0, "Invalid page size"), 
        });
        
        const validatedParams = ParamsSchema.safeParse(body);
        if (!validatedParams.success) {
          return NextResponse.json(validatedParams?.error?.issues, { status: 400 });
        }
    
        let pageNumber : number = body.pageNumber;
        let pageSize : number = body.pageSize;
        let criteria : String = body.criteria;
    
        let token = req.headers.get('Authorization');
        let trackingNumber = req.headers.get('x-tracking-number');
    
        const gymsPage = await searchGyms(token ?? "", trackingNumber ?? "", pageNumber, pageSize, criteria);
       
        return NextResponse.json(gymsPage, { status: 200 });
        
      } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
        */
}