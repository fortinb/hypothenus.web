"use client"

import { PhoneNumberTypeEnum } from "@/src/lib/entities/enum/phone-number-type-enum";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PhoneNumberInfo from "../contact/phone-number-info";

export default function BrandPhoneInfo() {

    return (
        <Row className="gx-2">
            <Col xs={4} >
                <PhoneNumberInfo index={0} id="brand_phone_0" defaultType={PhoneNumberTypeEnum.business} formStatefield="phoneNumbers.0" />
            </Col>
            <Col xs={4} >
                <PhoneNumberInfo index={1} id="brand_phone_1" defaultType={PhoneNumberTypeEnum.mobile} formStatefield="phoneNumbers.1" />
            </Col>
        </Row>
    );
}
