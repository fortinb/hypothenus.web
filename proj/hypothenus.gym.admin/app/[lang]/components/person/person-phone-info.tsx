"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function PersonPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={4} >
                <PhoneNumberInfo index={0} id="person_phone_0" defaultType={PhoneNumberTypeEnum.Business} formStatefield="person.phoneNumbers.0" />
            </Col>
            <Col xs={4} >
                <PhoneNumberInfo index={1} id="person_phone_1" defaultType={PhoneNumberTypeEnum.Mobile} formStatefield="person.phoneNumbers.1" />
            </Col>
        </Row>
    );
}