import { getGym } from "@/app/lib/data/gyms-data-service";
import GymForm from "./gym-form";
import GymMenu from "./gym-menu";
import GymResume from "./gym-resume";
import type { Gym } from "@/src/lib/entities/gym";
import { newGym } from "@/src/lib/entities/gym";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: { lang: string, brandId: string, gymId: string };
}

export default async function GymPage({ params }: PageProps) {
  let gym: Gym;

  if (params.gymId === "new") {
    gym = newGym();
    gym.gymId = "new";
    gym.brandId = params.brandId;
  } else {
    gym = await getGym(params.brandId, params.gymId);
  }

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "gym.[gymId].page",
          href: `/${params.lang}/brands/${params.brandId}/gyms/${params.gymId}`,
          crumb: gym.name
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymMenu lang={params.lang} brandId={params.brandId} gymId={params.gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymForm lang={params.lang} brandId={params.brandId} gymId={params.gymId} gym={gym} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymResume />
      </div>
    </div>

  );
}
