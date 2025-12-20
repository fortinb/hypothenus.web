"use client"

import { useParams } from "next/navigation";
import CoachForm from "./coach-form";
import CoachMenu from "./coach-menu";
import CoachResume from "./coach-resume";
export default function Coach() {
  const params = useParams<{ brandId: string; gymId: string; coachId: string }>();

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachMenu brandId={params.brandId} gymId={params.gymId} coachId={params.coachId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachForm brandId={params.brandId} gymId={params.gymId} coachId={params.coachId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachResume />
      </div>
    </div>
  );
}
