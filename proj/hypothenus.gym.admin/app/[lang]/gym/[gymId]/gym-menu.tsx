"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import Link from "next/link";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector } from "react-redux";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function GymMenu({ gymId }: { gymId: string }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const { t } = useTranslation("gym");

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
                    <Link className={"link-element" + (gymId == "new" ? " link-element-disabled" : "")} href={`/${i18n.resolvedLanguage}/gym/${gymId}`}><i className="icon icon-secondary bi bi-building h1 m-0"></i></Link>
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
                    <Link className={"link-element" + (gymId == "new" ? " link-element-disabled" : "")} href={`/${i18n.resolvedLanguage}/gym/${gymId}/coachs`}><i className="icon icon-secondary bi-person-arms-up h1 m-0"></i></Link>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <span className="text-primary mt-3">{t("menu.coachs")}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="d-flex flex-row align-items-end h-100">
        <div className="d-flex  flex-fill flex-row  align-items-end justify-content-center h-100 pb-2">
          <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="gym_menu_back_tooltip">{t("menu.managementTooltip")}</Tooltip>}>
            <Link className="btn btn-primary ms-2" href={`/${i18n.resolvedLanguage}/gyms`} ><i className="icon icon-light bi bi-backspace me-2"></i>{t("menu.management")}
            </Link>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
}
