"use client"

import { useTranslations } from "next-intl";
import { CoursesStatePaging, includeInactive } from "@/app/lib/store/slices/courses-state-paging-slice";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import Link from "next/link";
import { ChangeEvent } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Authorize } from "@/app/ui/components/security/authorize";

export default function CoursesMenu({ lang }: { lang: string; }) {
  const coursesStatePaging: CoursesStatePaging = useSelector((state: any) => state.coursesStatePaging);
  const gymState: GymState = useSelector((state: any) => state.gymState);

  const dispatch = useAppDispatch();
  const t = useTranslations("course");

  function onIncludeDeactivated(e: ChangeEvent<HTMLInputElement>) {
    dispatch(includeInactive(e.currentTarget.checked));
  }

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("list.menu.gym", { name: gymState.gym.name })}</h2>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <h3 className="text-secondary pt-0 ps-2">{t("list.menu.title")}
          <i className="icon icon-secondary bi-bicycle ms-2"></i>
        </h3>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <div className="d-flex flex-column h-100">
        <Container fluid={true}>
          <Authorize roles="manager">
            <Row className="gx-2">
              <Col xs={6} >
                <div className="btn-navigation m-2">
                  <div className="d-flex flex-column justify-content-center h-100">
                    <div className="d-flex flex-row justify-content-center">
                      <Link className="link-element" href={`/${lang}/admin/brands/${gymState.gym.brandUuid}/gyms/${gymState.gym.uuid}/courses/new`}><i className="icon icon-secondary bi bi-plus-square h1 m-0"></i></Link>
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                      <span className="text-primary mt-3">{t("list.menu.add")}</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={6} >
                <div className="d-flex flex-row align-items-center justify-content-center flex-fill h-100">
                  <div className="form-check form-switch pe-2">
                    <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch" name="includeDeactivate"
                      id="flexSwitchCheckChecked" onChange={onIncludeDeactivated} checked={coursesStatePaging.includeInactive} />
                    <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">{t("list.menu.inactive")}</label>
                  </div>
                </div>
              </Col>
            </Row>
          </Authorize>
        </Container>
      </div>
    </div>
  );
}
