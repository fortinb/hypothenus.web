"use client"

import { useParams } from "next/navigation";
import CourseForm from "./course-form";
import CourseMenu from "./course-menu";
import CourseResume from "./course-resume";
export default function Course() {
  const params = useParams<{ brandId: string; gymId: string; courseId: string }>();

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseMenu brandId={params.brandId} gymId={params.gymId} courseId={params.courseId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CourseForm brandId={params.brandId} gymId={params.gymId} courseId={params.courseId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseResume />  
      </div>
    </div>
  );
}
