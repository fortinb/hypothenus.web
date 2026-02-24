import { Member, newMember } from "@/src/lib/entities/member";
import { redirect } from "next/navigation";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { fetchGyms } from "@/app/lib/services/gyms-data-service";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import RegistrationForm from "./registration-form";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { LanguageEnum } from "@/src/lib/entities/language";
import { failure } from "@/app/lib/http/handle-result";
import { any } from "zod";

interface PageProps {
  params: Promise<{ lang: string; brandId: string }>;
}

export default async function MemberPage({ params }: PageProps) {
  const { lang, brandId } = await params;

  let member: Member;
  let pageOfGyms: Page<Gym>;
  try {
    member = newMember();
    member.brandUuid = brandId;
    member.person.communicationLanguage = lang as LanguageEnum;

    // Load list of gyms
    pageOfGyms = await fetchGyms(brandId, 0, 1000, false);
  } catch (error: any) {
    return failure(error);
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
          id: "registration.page",
          locale: `${lang}`,
          href: `/${lang}/public/${brandId}/registration`,
          key: "breadcrumb.registration",
          namespace: "welcome"
        }}
      />
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <RegistrationForm lang={lang} member={member} gyms={availableGymItems} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
      </div>
    </div>
  );
}