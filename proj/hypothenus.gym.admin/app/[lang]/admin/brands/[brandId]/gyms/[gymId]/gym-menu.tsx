"use client"

import { useTranslations } from "next-intl";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Gym } from "@/src/lib/entities/gym";

export default function GymMenu({ lang, gym }: { lang: string; gym: Gym }) {
  const t = useTranslations("gym");
  
  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("menu.gym", { name: gym.name })}</h2>
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
                    <Link className={"link-element" + (gym.uuid === null ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}`}><i className="icon icon-secondary bi bi-building h1 m-0"></i></Link>
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
                    <Link className={"link-element" + (gym.uuid === null ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}/coachs`}><i className="icon icon-secondary bi-person-arms-up h1 m-0"></i></Link>
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
                  <Link className={"link-element" + (gym.uuid === null ? " link-element-disabled" : "")} href={`/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}/courses`}><i className="icon icon-secondary bi-bicycle h1 m-0"></i></Link>
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
