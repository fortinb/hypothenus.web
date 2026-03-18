"use client"

import { useTranslations } from "next-intl";
import { MembershipPlanState } from "@/app/lib/store/slices/membership-plan-state-slice";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";
import { getMembershipPlanDescription, getMembershipPlanName, getMembershipPlanTitle } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";

export default function MembershipPlanResume({ lang }: { lang?: string }) {
  const membershipPlanState: MembershipPlanState = useSelector((state: any) => state.membershipPlanState);
  const t = useTranslations("membership-plan");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("resume.title")}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <Container fluid={true}>
        <Row className="gx-2">
          <Col xs={12} >
            <p className="card-text">
              <span className="text-primary">{getMembershipPlanTitle(membershipPlanState.membershipPlan, lang as LanguageEnum)}</span><br />
              <span className="text-primary">{getMembershipPlanName(membershipPlanState.membershipPlan, lang as LanguageEnum)}</span><br />
              <span className="text-primary">{getMembershipPlanDescription(membershipPlanState.membershipPlan, lang as LanguageEnum)}</span><br />
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
