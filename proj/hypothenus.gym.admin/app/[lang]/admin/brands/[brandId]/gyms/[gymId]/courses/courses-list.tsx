"use client"

import { Course } from "@/src/lib/entities/course";
import { Page } from "@/src/lib/entities/page";
import CourseListDetails from "./courses-list-details";

export default function CoursesList({ lang, brandId, gymId, pageOfCourses }: { lang: string; brandId: string; gymId: string; pageOfCourses?: Page<Course> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfCourses?.content.map((course: Course) => {
        return <CourseListDetails key={course.id} lang={lang} brandId={brandId} gymId={gymId} courseId={course.id} course={course}></CourseListDetails>
      })}

    </div>
  );
}