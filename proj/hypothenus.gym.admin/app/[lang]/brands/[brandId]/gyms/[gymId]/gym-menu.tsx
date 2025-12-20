"use client"

import { useTranslations } from "next-intl";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

export default function GymMenu({ brandId, gymId }: { brandId: string; gymId: string }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const t = useTranslations("gym");
  const params = useParams<{ lang: string }>();
  
  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.gym", { name: gymState.gym.name })}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-column h-100">
        <Container fluid={true}>
          <Row className="gx-2">
            <Col xs={6} >
              <div className="btn-navigation m-2">
                <div className="d-flex flex-column justify-content-center h-100">
                  <div className="d-flex flex-row justify-content-center">
                    <Link className={"link-element" + (gymState.gym.id == null ? " link-element-disabled" : "")} href={`/${params.lang}/brands/${brandId}/gyms/${gymId}`}><i className="icon icon-secondary bi bi-building h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.info")}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={6} >
              <div className="btn-navigation m-2">
                <div className="d-flex flex-column justify-content-center h-100">
                  <div className="d-flex flex-row justify-content-center">
                    <Link className={"link-element" + (gymState.gym.id == null ? " link-element-disabled" : "")} href={`/${params.lang}/brands/${brandId}/gyms/${gymId}/coachs`}><i className="icon icon-secondary bi-person-arms-up h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.coachs")}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="gx-2">
            <Col xs={6} >
              <div className="btn-navigation m-2">
                <div className="d-flex flex-column justify-content-center h-100">
                  <div className="d-flex flex-row justify-content-center">
                  <Link className={"link-element" + (gymState.gym.id == null ? " link-element-disabled" : "")} href={`/${params.lang}/brands/${brandId}/gyms/${gymId}/courses`}><i className="icon icon-secondary bi-bicycle h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.courses")}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
