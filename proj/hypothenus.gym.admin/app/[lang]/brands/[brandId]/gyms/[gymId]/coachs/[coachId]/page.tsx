
import { getCoach } from "@/app/lib/data/coachs-data-service";
import CoachForm from "./coach-form";
import CoachMenu from "./coach-menu";
import CoachResume from "./coach-resume";
import { Coach, newCoach } from "@/src/lib/entities/coach";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { formatPersonName } from "@/src/lib/entities/person";

interface PageProps {
  params: { lang: string, brandId: string, gymId: string, coachId: string };
}

export default async function CoachPage({ params }: PageProps) {
  let coach: Coach;

  if (params.coachId === "new") {
    coach = newCoach();
    coach.brandId = params.brandId;
    coach.gymId = params.gymId;
  } else {
    coach = await getCoach(params.brandId, params.gymId, params.coachId);
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "coach.[coachId].page",
          href: `/${params.lang}/brands/${params.brandId}/gyms/${params.gymId}/coachs/${params.coachId}`,
          crumb: formatPersonName(coach.person)
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachMenu lang={params.lang} brandId={params.brandId} gymId={params.gymId} coachId={params.coachId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachForm lang={params.lang} brandId={params.brandId} gymId={params.gymId} coachId={params.coachId} coach={coach} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachResume />
      </div>
    </div>
  );
}
