"use client"

import { Gym } from "@/src/lib/entities/gym";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function PhoneInfo({ register, errors }: { register: UseFormRegister<Gym>, errors: FieldErrors<Gym> }) {

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={4} >
                    <Form.Group>
                        <Form.Control type="hidden" id="phone_input_business_phone_type" value="Business" {...register("phoneNumbers.0.type")} />
                        <Form.Label className="text-primary" htmlFor="phone_input_business_phone_number" >Phone number</Form.Label>
                        <Form.Control type="input" id="phone_input_business_phone_number" placeholder="999 999-9999"  {...register("phoneNumbers.0.number")}
                            className={errors?.phoneNumbers?.[0] ? "input-invalid" : ""} />
                        {errors?.phoneNumbers?.[0]?.number && <Form.Text className="text-invalid">{errors?.phoneNumbers?.[0]?.number.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={4} >
                    <Form.Group>
                        <Form.Control type="hidden" id="phone_input_mobile_phone_type" value="Mobile" {...register("phoneNumbers.1.type")} />
                        <Form.Label className="text-primary" htmlFor="phone_input_mobile_phone_number" >Mobile number</Form.Label>
                        <Form.Control type="input" id="phone_input_mobile_phone_number" placeholder="999 999-9999"  {...register("phoneNumbers.1.number")}
                            className={errors?.phoneNumbers?.[1] ? "input-invalid" : ""} />
                        {errors?.phoneNumbers?.[1]?.number && <Form.Text className="text-invalid">{errors?.phoneNumbers?.[1]?.number.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}