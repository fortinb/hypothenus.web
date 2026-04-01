"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function GymPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={4} >
                <PhoneNumberInfo index={0} id="gym_phone_0" defaultType={PhoneNumberTypeEnum.business} formStatefield="gym.phoneNumbers.0"  parent="gym"/>
            </Col>
            <Col xs={4} >
                <PhoneNumberInfo index={1} id="gym_phone_1" defaultType={PhoneNumberTypeEnum.mobile} formStatefield="gym.phoneNumbers.1"  parent="gym"/>
            </Col>
        </Row>
    );
}