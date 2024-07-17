"use client"

import { Contact } from "@/src/lib/entities/contact";
import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";
import PhoneNumberInfo from "./phone-number-info";

export default function GymContactInfo({ index, id, formStatefield }:
    {
        index: number,
        id: string,
        formStatefield: string
    }) {

    const { register, formState: { errors } } = useFormContext();

    function getError(index: number): Merge<FieldError, FieldErrorsImpl<Contact>> {
        return (errors?.contacts as unknown as Merge<FieldError, FieldErrorsImpl<Contact>>[])?.[index];
    }

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"contact_input_firstname_" + id + index}>Firstname</Form.Label>
                        <Form.Control type="input" id={"contact_input_firstname_" + id + index}  {...register(formStatefield + ".firstname")}
                            className={getError(index)?.firstname ? "input-invalid" : ""} />
                        {getError(index)?.firstname && <Form.Text className="text-invalid">{getError(index)?.firstname?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"contact_input_lastname_" + id + index}>Lastname</Form.Label>
                        <Form.Control type="input" id={"contact_input_lastname_" + id + index}  {...register(formStatefield + ".lastname")}
                            className={getError(index)?.lastname ? "input-invalid" : ""} />
                        {getError(index)?.lastname && <Form.Text className="text-invalid">{getError(index)?.lastname?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"contact_input_description_" + id + index}>Description</Form.Label>
                        <Form.Control type="input" id={"contact_input_description_" + id + index}  {...register(formStatefield + ".description")}
                            className={getError(index)?.description ? "input-invalid" : ""} />
                        {getError(index)?.description && <Form.Text className="text-invalid">{getError(index)?.description?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"contact_input_email_" + id + index}>Email address</Form.Label>
                        <Form.Control type="input" id="contact_info_input_email" placeholder="example@email.ca" {...register(formStatefield + ".email")}
                            className={getError(index)?.email ? "input-invalid" : ""} />
                        {getError(index)?.email && <Form.Text className="text-invalid">{getError(index)?.email?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={4} >
                    <PhoneNumberInfo index={0} id="contact_phone" defaultType={PhoneNumberTypeEnum.Home} formStatefield={formStatefield + ".phoneNumbers.0"} />
                </Col>
                <Col xs={4} >
                    <PhoneNumberInfo index={1} id="contact_phone" defaultType={PhoneNumberTypeEnum.Mobile} formStatefield={formStatefield + ".phoneNumbers.1"} />
                </Col>
            </Row>
        </Container>
    );
}