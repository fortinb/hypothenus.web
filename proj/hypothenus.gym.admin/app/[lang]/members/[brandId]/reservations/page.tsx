
import { redirect } from "next/navigation";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { fetchGyms } from "@/app/lib/services/gyms-data-service";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function ReservationsPage({ params }: PageProps) {
  const { lang, brandId } = await params;

let pageOfGyms: Page<Gym>;
  try {
    pageOfGyms = await fetchGyms(brandId, 0, 1000, false);
  } catch (error) {
    console.error("Error fetching member:", error);
    return redirect(`/${lang}/error`);
  }

  let gyms: Gym[] = pageOfGyms.content;

  const availableGymItems: GymListItem[] = gyms?.map((gym: Gym) => {
    return {
      gym: gym,
      label: gym.name,
      value: gym.uuid,
    } as GymListItem;
  });

  availableGymItems.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "reservations.page",
          locale: `${lang}`,
          href: `/${lang}/members/${brandId}/reservations`,
          key: "breadcrumb.reservations",
          namespace: "member"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}