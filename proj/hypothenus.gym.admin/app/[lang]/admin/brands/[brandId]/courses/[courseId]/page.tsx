import { Course, newCourse, getCourseName } from "@/src/lib/entities/course";
import CourseForm from "./course-form";
import CourseMenu from "./course-menu";
import CourseResume from "./course-resume";
import { getCourse } from "@/app/lib/services/courses-data-service";
import { Breadcrumb } from "@/app/ui/components/navigation/breadcrumb";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { redirect } from "next/navigation";
import { auth } from "@/src/security/auth";
import { failure } from "@/app/lib/http/handle-result";

interface PageProps {
  params: Promise<{ lang: string; brandId: string; courseId: string }>;
}

export default async function CoursePage({ params }: PageProps) {
  const { lang, brandId, courseId } = await params;

  const session = await auth();
  if (!session) {
    redirect("/public/signin");
  }

  let course: Course;
  try {
    if (courseId === "new") {
      course = newCourse();
    } else {
      course = await getCourse(brandId, courseId);
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
          id: "course.[courseId].page",
          locale: `${lang}`,
          href: `/admin/brands/${brandId}/courses/${courseId}`,
          key: "",
          value: getCourseName(course, lang as LanguageEnum),
          namespace: ""
        }}
      />

      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseMenu lang={lang} course={course} />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <CourseForm lang={lang} course={course} />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <CourseResume lang={lang} />
      </div>
    </div>
  );
}
