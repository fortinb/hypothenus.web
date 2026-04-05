"use client";

import { useTranslations } from "next-intl";
import { Course } from "@/src//lib/entities/course";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";

export default function CourseListDetails({ lang, course }: { lang: string; course: Course }) {
  const t = useTranslations("course");

  return (
    <div className="col-6 p-2">
      <Card className="card-min-height">
        <Card.Body className={"m-2" + (course.active == false ? " card-body-inactive" : "")}>
          <Card.Title >
            <Link className="link-element" href={`/${lang}/admin/brands/${course.brandUuid}/courses/${course.uuid}`}> 
              {getCourseName(course, lang as LanguageEnum )}
            </Link>
          </Card.Title>
          <Card.Text>
            {course.active == false &&
              <>
                <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
              </>
            }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}