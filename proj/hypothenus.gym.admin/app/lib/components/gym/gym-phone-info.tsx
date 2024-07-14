"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function GymPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={4} >
                <PhoneNumberInfo index={0} id="gym_phone_0" defaultType={PhoneNumberTypeEnum.Business} formStatefield="phoneNumbers.0" />
            </Col>
            <Col xs={4} >
                <PhoneNumberInfo index={1} id="gym_phone_1" defaultType={PhoneNumberTypeEnum.Mobile} formStatefield="phoneNumbers.1" />
            </Col>
        </Row>
    );
}