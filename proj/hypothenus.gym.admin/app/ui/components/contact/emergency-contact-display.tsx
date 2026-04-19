"use client"

import { Contact, formatContactName } from "@/src/lib/entities/contact/contact";
import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberDisplay from "./phone-number-display";

export default function EmergencyContactDisplay({ contact, index }: { contact: Contact, index: number }) {
  const t = useTranslations("entity");

  return (
    <Row key={index} className="gx-2">
      <Col xs={12} >
        <div className="d-flex flex-row justify-content-center">
          <span className="text-tertiary fw-bold h5">{formatContactName(contact)}</span><br />
        </div>
        <div className="d-flex flex-row justify-content-center mb-2">
          <span className="text-primary-small">{contact.description}</span>
        </div>
        {contact.phoneNumbers?.map((phoneNumber, i) => (
          <div key={i} className="d-flex flex-row justify-content-center">
            <PhoneNumberDisplay phoneNumber={phoneNumber} />
          </div>
        ))}
        <hr />
      </Col>
    </Row>

  );
}

