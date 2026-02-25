
import { getCoach } from "@/app/lib/services/coachs-data-service";
import CoachForm from "./coach-form";
import CoachMenu from "./coach-menu";
import CoachResume from "./coach-resume";
import { Coach, newCoach } from "@/src/lib/entities/coach";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { formatPersonName } from "@/src/lib/entities/person";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { failure } from "@/app/lib/http/handle-result";

interface PageProps {
  params: Promise<{ lang: string; brandId: string, gymId: string, coachId: string }>;
}

export default async function CoachPage({ params }: PageProps) {
  const { lang, brandId, gymId, coachId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }

  let coach: Coach;
  try {
    if (coachId === "new") {
      coach = newCoach();
    } else {
      coach = await getCoach(brandId, gymId, coachId);
    }
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "coach.[coachId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`,
          key: "",
          value: formatPersonName(coach.person),
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachMenu lang={lang} coach={coach} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachForm lang={lang} coach={coach} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CoachResume />
      </div>
    </div>
  );
}
