import { Course, newCourse, getCourseName } from "@/src/lib/entities/course";
import CourseForm from "./course-form";
import CourseMenu from "./course-menu";
import CourseResume from "./course-resume";
import { getCourse } from "@/app/lib/services/courses-data-service";
import { Page } from "@/src/lib/entities/page";
import { Coach } from "@/src/lib/entities/coach";
import { fetchCoachs } from "@/app/lib/services/coachs-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { LanguageEnum } from "@/src/lib/entities/language";
import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";
import { formatPersonName } from "@/src/lib/entities/person";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; gymId: string; courseId: string }>; 
}

export default async function CoursePage({ params }: PageProps) {
  const { lang, brandId, gymId, courseId } = await params;  

  let course: Course;
  let pageOfCoachs: Page<Coach>;

  if (courseId === "new") { 
    course = newCourse();
    course.brandId = brandId;  
    course.gymId = gymId;  

    // Load list of coachs
    pageOfCoachs = await fetchCoachs(brandId, gymId, 0, 1000, false);  
  } else {
    // Load in parallel
    [course, pageOfCoachs] = await Promise.all([
      getCourse(brandId, gymId, courseId),  
      fetchCoachs(brandId, gymId, 0, 1000, false)  
    ]);
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
    .filter((item) => course.coachs?.some((selected) => selected.uuid === item.coach.uuid))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <Breadcrumb
        crumb={{
          reset: false,
          id: "course.[courseId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/gyms/${gymId}/courses/${courseId}`,  
          key: "",
          value: getCourseName(course, lang as LanguageEnum), 
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseMenu lang={lang} brandId={brandId} gymId={gymId} courseId={courseId} /> 
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CourseForm lang={lang} brandId={brandId} gymId={gymId} courseId={courseId} course={course} coachs={coachs} initialAvailableCoachItems={availableCoachItems} initialSelectedCoachItems={initialSelectedCoachItems} />  
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseResume lang={lang} />  // Use lang
      </div>
    </div>
  );
}
