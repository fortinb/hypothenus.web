import { getRequestContext } from "@/app/lib/http/requestContext";
import { createCourse, fetchCourses } from "@/app/lib/ssr/courses-data-service";
import { Course } from "@/src/lib/entities/course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { brandId: string, gymId: string} }) {

  try {
    const { searchParams } = new URL(req.url);

    const requestContext = getRequestContext(req);

    const page: number = parseInt(searchParams.get("page") ?? "0");
    const pageSize: number = parseInt(searchParams.get("pageSize") ?? "10");
    const includeInactive: boolean = (searchParams.get("includeInactive")?.toLocaleLowerCase() == "true" ? true : false);

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json("Invalid parameters", { status: 400 });
    }

    const coursesPage = await fetchCourses(requestContext, params.brandId, params.gymId, page, pageSize, includeInactive);

    return NextResponse.json(coursesPage, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { brandId: string, gymId: string} }) {

  try {
    let course: Course = await req.json();

    const requestContext = getRequestContext(req);

    course = await createCourse(requestContext, params.brandId, params.gymId, course);

    return NextResponse.json(course, { status: 200 });

  } catch (err) {

    return NextResponse.json({ body: err }, { status: 400 });
  }
}