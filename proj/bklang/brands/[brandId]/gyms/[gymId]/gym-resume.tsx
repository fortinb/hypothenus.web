"use client"

import { useTranslations } from "next-intl";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { formatAddress } from "@/src/lib/entities/address";
import { Contact, formatContactName } from "@/src/lib/entities/contact";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

export default function GymResume() {
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const t = useTranslations("gym");
  
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
              <Link className="link-element" href={`mailto:${gymState.gym.email}`}>{gymState.gym.email}</Link><br />
              <span className="text-primary">{gymState.gym.phoneNumbers[0]?.number}</span><br />
              <span className="text-primary">{gymState.gym.phoneNumbers[1]?.number}</span><br />
            </p>
          </Col>
        </Row>

        {gymState.gym.contacts?.map((contact: Contact, index: number) => {

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
              <span className="text-primary">{formatAddress(gymState.gym.address)}</span>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
