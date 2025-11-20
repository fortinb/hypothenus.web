"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { CourseState } from "@/app/lib/store/slices/course-state-slice";
import { formatDate } from "@/app/lib/utils/dateUtils";
import { LanguageEnum } from "@/src/lib/entities/language";
import { LocalizedString } from "@/src/lib/entities/localizedString";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

export default function CourseResume() {
  const courseState: CourseState = useSelector((state: any) => state.courseState);
  const { t } = useTranslation("course");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">
          {courseState.course.name?.map((name: LocalizedString, index: number) => {

            if (name.language === i18n.resolvedLanguage as LanguageEnum) {
              return <span className="text-secondary fw-bolder">{name.text}</span>
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

          if (description.language === i18n.resolvedLanguage as LanguageEnum) {
            return <Row key={index} className="gx-2">
              <Col xs={12} >
                <p className="card-text">
                  <span className="text-primary">{description.text}</span><br />
                </p>
              </Col>
            </Row>
          }
        })}

        <hr />
        <Row className="gx-2">
          <Col xs={6} >
            <p className="card-text">
              <span className="text-primary">{t("resume.activatedOn")}</span><br />
              <span className="text-primary">{formatDate(courseState.course.startDate)}</span><br />
            </p>
          </Col>
          <Col xs={6} >
            <p className="card-text">
              <span className="text-primary">{t("resume.deactivatedOn")}</span><br />
              <span className="text-primary">{formatDate(courseState.course.endDate)}</span><br />
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
