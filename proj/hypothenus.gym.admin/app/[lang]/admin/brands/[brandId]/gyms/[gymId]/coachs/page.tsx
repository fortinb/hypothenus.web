import { auth } from "@/src/security/auth";
import { Breadcrumb } from '@/app/ui/components/navigation/breadcrumb';
import { redirect } from "next/navigation";
import CoachsMenu from "./coachs-menu";
import CoachsList from "./coachs-list";
import { Page } from "@/src/lib/entities/page";
import { Coach } from "@/src/lib/entities/coach"
import { Gym } from "@/src/lib/entities/gym";
import { fetchCoachs } from "@/app/lib/services/coachs-data-service";
import { getGym } from "@/app/lib/services/gyms-data-service";
import { failure } from "@/app/lib/http/handle-result";
import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";
import { formatPersonName } from "@/src/lib/entities/person";

interface PageProps {
  params: Promise<{ lang: string; brandId: string, gymId: string }>;
}

export default async function Coachs({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/public/signin");
  }

  let pageOfCoachs: Page<Coach>;
  try {
    pageOfCoachs = await fetchCoachs(brandId, 0, 1000, false);

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

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "gym.coachs.page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}/coachs`,
          key: "breadcrumb",
          namespace: "coach"
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-5">
        <CoachsMenu lang={lang} initialAvailableCoachItems={availableCoachItems} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CoachsList lang={lang} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100">

      </div>
    </div>
  );
}

