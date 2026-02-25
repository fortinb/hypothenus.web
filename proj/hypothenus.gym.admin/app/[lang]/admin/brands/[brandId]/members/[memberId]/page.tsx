
import { getMember } from "@/app/lib/services/members-data-service";
import MemberForm from "./member-form";
import MemberMenu from "./member-menu";
import MemberResume from "./member-resume";
import { Member, newMember } from "@/src/lib/entities/member";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { formatPersonName } from "@/src/lib/entities/person";
import { redirect } from "next/navigation";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { fetchGyms } from "@/app/lib/services/gyms-data-service";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import { auth } from "@/src/security/auth";
import { failure } from "@/app/lib/http/handle-result";

interface PageProps {
  params: Promise<{ lang: string; brandId: string, memberId: string }>;
}

export default async function MemberPage({ params }: PageProps) {
  const { lang, brandId, memberId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }

  let member: Member;
  let pageOfGyms: Page<Gym>;
  try {
    if (memberId === "new") {
      member = newMember();
      // Load list of gyms
      pageOfGyms = await fetchGyms(brandId, 0, 1000, false);
    } else {
      // Load in parallel
      [member, pageOfGyms] = await Promise.all([
        getMember(brandId, memberId),
        fetchGyms(brandId, 0, 1000, false)
      ]);
    }
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
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
          id: "member.[memberId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/members/${memberId}`,
          key: "",
          value: formatPersonName(member.person),
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <MemberMenu lang={lang} member={member} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <MemberForm lang={lang} member={member} gyms={availableGymItems} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <MemberResume />
      </div>
    </div>
  );
}
