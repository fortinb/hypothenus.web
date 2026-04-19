"use client"

import { useTranslations } from "next-intl";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { Contact } from "@/src/lib/entities/contact/contact";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";
import EmergencyContactDisplay from "@/app/ui/components/contact/emergency-contact-display";
import PhoneNumberDisplay from "@/app/ui/components/contact/phone-number-display";
import AddressDisplay from "@/app/ui/components/contact/address-display";

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
            <div className="d-flex flex-row justify-content-center mb-2">
              <Link className="link-element" href={`mailto:${gymState.gym.email}`}>{gymState.gym.email}</Link><br />
            </div>
            {gymState.gym.phoneNumbers?.map((phoneNumber, index) => (
              <div key={index} className="d-flex flex-row justify-content-center">
                <PhoneNumberDisplay phoneNumber={phoneNumber} />
              </div>
            ))}
            <div className="d-flex flex-row justify-content-center mb-2">
              <AddressDisplay address={gymState.gym.address} />
            </div>
            <div className="ps-2 pe-2">
              <hr />
            </div>
          </Col>
        </Row>

        {gymState.gym.contacts?.map((contact: Contact, index: number) => {
          return (
            <Row key={index} className="gx-2">
              <Col xs={12} >
                <EmergencyContactDisplay contact={contact} index={index} />
              </Col>
            </Row>
          )
        })}

      </Container>
    </div>
  );
}
