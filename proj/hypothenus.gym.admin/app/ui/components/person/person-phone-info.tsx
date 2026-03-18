"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function PersonPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={4} >
                <PhoneNumberInfo index={0} id="person_phone_0" defaultType={PhoneNumberTypeEnum.home} formStatefield="person.phoneNumbers.0" parent="person"/>
            </Col>
            <Col xs={4} >
                <PhoneNumberInfo index={1} id="person_phone_1" defaultType={PhoneNumberTypeEnum.mobile} formStatefield="person.phoneNumbers.1" parent="person"/>
            </Col>
        </Row>
    );
}