"use client"

import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { useSelector } from "react-redux";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { formatAddress } from "@/src/lib/entities/address";
import Link from "next/link";
import { Contact, formatName } from "@/src/lib/entities/contact";

export default function GymResume() {
  const gymState: GymState = useSelector((state: any) => state.gymState);

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">Contacts</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <Container fluid={true}>
        <Row className="gx-2">
          <Col xs={12} >
            <p className="card-text">
              <Link className="link-element" href={"mailto:" + gymState.gym.email}>{gymState.gym.email}</Link><br />
              <span className="text-primary">{gymState.gym.phoneNumbers[0]?.number}</span><br />
              <span className="text-primary">{gymState.gym.phoneNumbers[1]?.number}</span><br />
            </p>
          </Col>
        </Row>

        {gymState.gym.contacts?.map((contact: Contact, index: number) => {
          return <Row className="gx-2">
            <Col xs={12} >
              <hr />
              <p className="card-text">
                <span className="text-primary">{formatName(contact)}</span><br />
                <span className="text-primary">{contact.description}</span><br />
                <Link className="link-element" href={"mailto:" + contact?.email}>{contact.email}</Link><br />
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
