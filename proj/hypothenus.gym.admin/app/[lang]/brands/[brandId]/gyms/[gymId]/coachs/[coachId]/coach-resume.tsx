"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { CoachState } from "@/app/lib/store/slices/coach-state-slice";
import { formatAddress } from "@/src/lib/entities/address";
import { Contact, formatContactName } from "@/src/lib/entities/contact";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

export default function CoachResume() {
  const coachState: CoachState = useSelector((state: any) => state.coachState);
  const { t } = useTranslation("coach");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("resume.contacts")}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <Container fluid={true}>
        <Row className="gx-2">
          <Col xs={12} >
            <p className="card-text">
              <Link className="link-element" href={`mailto:${coachState.coach.person.email}`}>{coachState.coach.person.email}</Link><br />
              <span className="text-primary">{coachState.coach.person.phoneNumbers[0]?.number}</span><br />
              <span className="text-primary">{coachState.coach.person.phoneNumbers[1]?.number}</span><br />
            </p>
          </Col>
        </Row>

        {coachState.coach.person.contacts?.map((contact: Contact, index: number) => {

          return <Row key={index} className="gx-2">
            <Col xs={12} >
              <hr />
              <p className="card-text">
                <span className="text-secondary fw-bolder">{formatContactName(contact)}</span><br />
                <span className="text-primary">{contact.description}</span><br />
                <Link className="link-element" href={`mailto:${contact?.email}`}>{contact.email}</Link><br />
                <span className="text-primary">{contact.phoneNumbers[0]?.number}</span><br />
                <span className="text-primary">{contact.phoneNumbers[1]?.number}</span><br />
              </p>
            </Col>
          </Row>

        })}

        <Row className="gx-2">
          <Col xs={12} >
            <hr />
            <p className="card-text">
              {coachState?.coach?.person?.address &&
                <span className="text-primary">{formatAddress(coachState.coach.person.address)}</span>
              }
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
