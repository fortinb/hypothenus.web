import { getMembershipPlan } from "@/app/lib/services/membership-plans-data-service";
import MembershipPlanForm from "./membership-plan-form";
import MembershipPlanMenu from "./membership-plan-menu";
import MembershipPlanResume from "./membership-plan-resume";
import { MembershipPlan, newMembershipPlan } from "@/src/lib/entities/membership-plan";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { getMembershipPlanName } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { failure } from "@/app/lib/http/handle-result";
import { Page } from "@/src/lib/entities/page";
import { Gym } from "@/src/lib/entities/gym";
import { Course, getCourseName } from "@/src/lib/entities/course";
import { fetchGyms } from "@/app/lib/services/gyms-data-service";
import { fetchCourses } from "@/app/lib/services/courses-data-service";
import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { CourseSelectedItem } from "@/src/lib/entities/ui/course-selected-item";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; membershipPlanId: string }>;
}

export default async function MembershipPlanPage({ params }: PageProps) {
  const { lang, brandId, membershipPlanId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }

  let membershipPlan: MembershipPlan;
  let pageOfGyms: Page<Gym>;
  let pageOfCourses: Page<Course>;

  try {
    if (membershipPlanId === "new") {
      membershipPlan = newMembershipPlan();

      [pageOfGyms, pageOfCourses] = await Promise.all([
        fetchGyms(brandId, 0, 1000, false),
        fetchCourses(brandId, 0, 1000, false)
      ]);
    } else {
      [membershipPlan, pageOfGyms, pageOfCourses] = await Promise.all([
        getMembershipPlan(brandId, membershipPlanId),
        fetchGyms(brandId, 0, 1000, false),
        fetchCourses(brandId, 0, 1000, false)
      ]);
    }
  } catch (error: any) {
    failure(error);
    redirect(`/${lang}/error`);
  }

  let gyms: Gym[] = pageOfGyms.content;
  let courses: Course[] = pageOfCourses.content;

  const availableGymItems: GymSelectedItem[] = gyms?.map((gym: Gym) => {
    return {
      gym: gym,
      label: gym.name,
      value: gym.uuid,
    } as GymSelectedItem;
  });

  const availableCourseItems: CourseSelectedItem[] = courses?.map((course: Course) => {
    return {
      course: course,
      label: getCourseName(course, lang as LanguageEnum),
      value: course.uuid,
    } as CourseSelectedItem;
  });

  const initialSelectedGymItems = availableGymItems
    .filter((item) => membershipPlan.includedGyms?.some((selected) => selected.uuid === item.gym.uuid))
    .sort((a, b) => a.label.localeCompare(b.label));

  const initialSelectedCourseItems = availableCourseItems
    .filter((item) => membershipPlan.includedCourses?.some((selected) => selected.uuid === item.course.uuid))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "membershipPlan.[membershipPlanId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/membership-plans/${membershipPlanId}`,
          key: "",
          value: getMembershipPlanName(membershipPlan, lang as LanguageEnum),
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <MembershipPlanMenu lang={lang} membershipPlan={membershipPlan} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <MembershipPlanForm lang={lang}
          membershipPlan={membershipPlan}
          initialAvailableGymItems={availableGymItems}
          initialSelectedGymItems={initialSelectedGymItems}
          initialAvailableCourseItems={availableCourseItems}
          initialSelectedCourseItems={initialSelectedCourseItems} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <MembershipPlanResume lang={lang} />
      </div>
    </div>
  );
}
