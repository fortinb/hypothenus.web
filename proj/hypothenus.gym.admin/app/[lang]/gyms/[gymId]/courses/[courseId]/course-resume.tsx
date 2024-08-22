"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { CourseState } from "@/app/lib/store/slices/course-state-slice";
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
        <h2 className="text-secondary pt-4 ps-2"></h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>

      <Container fluid={true}>
        <Row className="gx-2">
          <Col xs={12} >
            <p className="card-text">
              
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
