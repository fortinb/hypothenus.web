import { getRequestContext } from "@/app/lib/http/requestContext";
import { deleteCourse, getCourse, updateCourse } from "@/app/lib/ssr/courses-data-service";
import { Course } from "@/src/lib/entities/course";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { gymId: string,  courseId: string } }) {

  try {
    const requestContext = getRequestContext(req);

    const course = await getCourse(requestContext, params.gymId, params.courseId);

    return NextResponse.json(course, { status: 200 });

  } catch (err) {
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { gymId: string,  courseId: string } }) {

  let course: Course = await req.json();
  try {

    const requestContext = getRequestContext(req);

    course = await updateCourse(requestContext, params.gymId, params.courseId, course);

    return NextResponse.json(course, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { gymId: string,  courseId: string } }) {

  try {

    const requestContext = getRequestContext(req);

    await deleteCourse(requestContext, params.gymId, params.courseId);

    return NextResponse.json({ status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}