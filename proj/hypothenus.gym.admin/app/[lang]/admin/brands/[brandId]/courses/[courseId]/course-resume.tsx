"use client"

import { useTranslations } from "next-intl";
import { CourseState } from "@/app/lib/store/slices/course-state-slice";
import { formatDate } from "@/app/lib/utils/dateUtils";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { LocalizedString } from "@/src/lib/entities/localized/localized-string";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

export default function CourseResume({ lang }: { lang: string }) {
  const courseState: CourseState = useSelector((state: any) => state.courseState);
  const t = useTranslations("course");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">
          {courseState.course.name?.map((name: LocalizedString, index: number) => {

            if (name.language === lang as LanguageEnum) {
              return <span key={index} className="text-secondary fw-bolder">{name.text}</span>
            }
          })}
        </h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>

      <Container fluid={true}>
        <br />
        {courseState.course.description?.map((description: LocalizedString, index: number) => {

          if (description.language === lang as LanguageEnum) {
            return <Row key={index} className="gx-2">
              <Col xs={12} >
                <div className="d-flex flex-row justify-content-center mb-2">
                  <span className="text-primary">{description.text}</span><br />
                </div>
              </Col>
            </Row>
          }
        })}

        <hr />
        <Row className="gx-2">
          <Col xs={12} >
            <div className="d-flex flex-row justify-content-center mb-2">
              <span className="text-tertiary fw-bolder">{t("resume.activatedOn")}</span>
            </div>
            <div className="d-flex flex-row justify-content-center mb-2">
              <span className="text-primary">{formatDate(courseState.course.startDate)}</span><br />
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="gx-2">
          <Col xs={12} >
            <div className="d-flex flex-row justify-content-center mb-2">
              <span className="text-tertiary fw-bolder">{t("resume.deactivatedOn")}</span>
            </div>
            <div className="d-flex flex-row justify-content-center mb-2">
              <span className="text-tertiary">{formatDate(courseState.course.endDate)}</span><br />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
