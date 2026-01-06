"use client";

import { useTranslations } from "next-intl";
import { Course } from "@/src//lib/entities/course";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";

export default function CourseListDetails({ lang, brandId, gymId, courseId, course }: { lang: string; brandId: string; gymId: string; courseId: string;   course: Course }) {
  const t = useTranslations("course");

  return (
    <div className="col-6 p-2">
      <Card>
        <Card.Body className={"m-2" + (course.isActive == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${courseId}`}> {getCourseName(course, lang as LanguageEnum )}</Link>
          </Card.Title>
          <Card.Text>
            {course.isActive == false &&
              <div>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </div>
            }
          </Card.Text>
        </Card.Body>
      </Card>
      
    </div>
  );
}