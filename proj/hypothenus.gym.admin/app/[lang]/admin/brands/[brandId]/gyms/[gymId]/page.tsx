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

interface PageProps {
  params: Promise<{ lang: string; brandId: string; gymId: string }>;
}

export default async function GymPage({ params }: PageProps) {
  const { lang, brandId, gymId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }

  let gym: Gym;

  try {
    if (gymId === "new") {
      gym = newGym();
    } else {
      gym = await getGym(brandId, gymId);
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
        <GymForm lang={lang} gym={gym} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <GymResume />
      </div>
    </div>
  );
}
