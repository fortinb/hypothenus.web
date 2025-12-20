
import { useParams } from "next/navigation";
import CoachForm from "./coach-form";
import CoachMenu from "./coach-menu";
import CoachResume from "./coach-resume";

interface PageProps {
  params: { lang: string, brandId: string, gymId: string, courseId: string, coachId: string };
}

export default async function Coach({ params }: PageProps) {

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
