"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function PersonPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={6} >
                <PhoneNumberInfo index={1} id="person_phone_1" defaultType={PhoneNumberTypeEnum.Mobile} formStatefield="person.phoneNumbers.1" parent="person"/>
            </Col>
        </Row>
    );
}