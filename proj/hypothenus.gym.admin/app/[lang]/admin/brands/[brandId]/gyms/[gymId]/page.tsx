import { getGym } from "@/app/lib/services/gyms-data-service";
import GymForm from "./gym-form";
import GymMenu from "./gym-menu";
import GymResume from "./gym-resume";
import type { Gym } from "@/src/lib/entities/gym";
import { newGym } from "@/src/lib/entities/gym";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; gymId: string }>;
}

export default async function GymPage({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  let gym: Gym;

  if (gymId === "new") {
    gym = newGym();
    gym.brandId = brandId;
  } else {
    gym = await getGym(brandId, gymId);
  }

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
        <GymMenu lang={lang} brandId={brandId} gymId={gymId} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymForm lang={lang} brandId={brandId} gymId={gymId} gym={gym} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymResume />
      </div>
    </div>
  );
}
