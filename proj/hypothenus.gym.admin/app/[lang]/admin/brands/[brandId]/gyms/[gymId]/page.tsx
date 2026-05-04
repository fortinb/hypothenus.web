import { getGym } from "@/app/lib/services/gyms-data-service";
import GymForm from "./gym-form";
import GymMenu from "./gym-menu";
import GymResume from "./gym-resume";
import type { Gym } from "@/src/lib/entities/gym";
import { newGym } from "@/src/lib/entities/gym";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { failure } from "@/app/lib/http/handle-result";
import { Page } from "@/src/lib/entities/paging/page";
import { Coach } from "@/src/lib/entities/coach";
import { fetchCoachs } from "@/app/lib/services/coachs-data-service";
import { formatPersonName } from "@/src/lib/entities/contact/person";
import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; gymId: string }>;
}

export default async function GymPage({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/public/signin");
  }

  let gym: Gym;
  let pageOfCoachs: Page<Coach>;

  try {
    if (gymId === "new") {
      gym = newGym();
      pageOfCoachs = await fetchCoachs(brandId, 0, 1000, false);
    } else {
      [gym, pageOfCoachs] = await Promise.all([
        getGym(brandId, gymId),
        fetchCoachs(brandId, 0, 1000, false)
      ]);
    }
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  let coachs: Coach[] = pageOfCoachs.content;
  const availableCoachItems: CoachSelectedItem[] = coachs?.map((coach: Coach) => {
    return {
      coach: coach,
      label: formatPersonName(coach.person),
      value: coach.uuid,
    } as CoachSelectedItem;
  });

  const initialSelectedCoachItems = availableCoachItems
    .filter((item) => gym.coachs?.some((selected) => selected.uuid === item.coach.uuid))
    .sort((a, b) => a.coach.person.lastname.localeCompare(b.coach.person.lastname));

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "gym.[gymId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}`,
          key: "",
          value: gym.name,
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymMenu lang={lang} gym={gym} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymForm lang={lang}
          gym={gym}
          initialAvailableCoachItems={availableCoachItems}
          initialSelectedCoachItems={initialSelectedCoachItems} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymResume />
      </div>
    </div>
  );
}
