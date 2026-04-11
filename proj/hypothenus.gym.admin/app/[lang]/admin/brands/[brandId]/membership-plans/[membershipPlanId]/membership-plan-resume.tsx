"use client"

import { MembershipPlanState } from "@/app/lib/store/slices/membership-plan-state-slice";
import MembershipPlanCard from "@/app/ui/components/membership-plan/membership-plan-card";
import { createTranslators } from "@/i18n/create-translators";
import enMessages from "@/messages/en/entity.json";
import frMessages from "@/messages/fr/entity.json";
import { AbstractIntlMessages, useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

const messagesMap: Record<string, AbstractIntlMessages> = {
  en: { entity: enMessages },
  fr: { entity: frMessages },
};

const translators = createTranslators("entity", messagesMap);

export default function MembershipPlanResume({ lang }: { lang: string }) {
  const membershipPlanState: MembershipPlanState = useSelector((state: any) => state.membershipPlanState);
  const t = useTranslations("entity");

  return (
    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("membershipPlan.resume.title")}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <Container fluid={true}>
        <Row className="gx-2">
          <Col xs={12} >
            {translators.map(({ locale, t: tLocale }, index) => (
                <MembershipPlanCard
                  key={index}
                  membershipPlan={membershipPlanState.membershipPlan}
                  lang={locale}
                  tLocale={tLocale}
                  linkActive={false}
                  onlyDisplay={true}
                />
     
            ))}
           </Col>
        </Row>
      </Container>
    </div>
  );
}
 
