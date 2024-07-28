"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { Person } from "@/src/lib/entities/person";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";
import PersonAddressInfo from "./person-address-info";
import PersonPhoneInfo from "./person-phone-info";
import PersonEmergencyContactInfo from "./person-emergency-contact-info";

export default function PersonInfo({ id, formStatefield, isEditMode }:
    {
        id: string,
        formStatefield: string,
        isEditMode: boolean
    }) {
    const { t } = useTranslation("entity");
    const { register, formState: { errors } } = useFormContext();

    function getError(): Merge<FieldError, FieldErrorsImpl<Person>> {
        return (errors?.person as unknown as Merge<FieldError, FieldErrorsImpl<Person>>);
    }

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_firstname_${id}`}>{t("person.firstname")}</Form.Label>
                        <Form.Control type="input" id={`person_input_firstname_${id}`}  {...register(`${formStatefield}.firstname`)}
                            className={getError()?.firstname ? "input-invalid" : ""} />
                        {getError()?.firstname && <Form.Text className="text-invalid">{t(getError()?.firstname?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_photoUri_${id}`}>{t("person.photoUri")}</Form.Label>
                        <Form.Control type="input" id={`person_input_photoUri_${id}`}  {...register(`${formStatefield}.photoUri`)}
                            className={getError()?.lastname ? "input-invalid" : ""} />
                        {getError()?.photoUri && <Form.Text className="text-invalid">{t(getError()?.photoUri?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_lastname_${id}`}>{t("person.lastname")}</Form.Label>
                        <Form.Control type="input" id={`person_input_lastname_${id}`}  {...register(`${formStatefield}.lastname`)}
                            className={getError()?.lastname ? "input-invalid" : ""} />
                        {getError()?.lastname && <Form.Text className="text-invalid">{t(getError()?.lastname?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_dateOfBirth_${id}`}>{t("person.dateOfBirth")}</Form.Label>
                        <Form.Control type="input" id={`person_input_dateOfBirth_${id}`}  {...register(`${formStatefield}.dateOfBirth`)}
                            className={getError()?.dateOfBirth ? "input-invalid" : ""} />
                        {getError()?.dateOfBirth && <Form.Text className="text-invalid">{t(getError()?.dateOfBirth?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_email_${id}`}>{t("person.email")}</Form.Label>
                        <Form.Control type="input" id="person_info_input_email" placeholder="example@email.ca" {...register(`${formStatefield}.email`)}
                            className={getError()?.email ? "input-invalid" : ""} />
                        {getError()?.email && <Form.Text className="text-invalid">{t(getError()?.email?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="m-0 pt-2">
                <Accordion >
                    <Accordion.Item eventKey="0" className="pt-2">
                        <Accordion.Header className={(errors?.address ? "accordeon-header-invalid" : "")}>{t("person.address")}</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Row className="m-2 p-2">
                                <Col xs={12} className="p-1" >
                                    <PersonAddressInfo />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="pt-2">
                        <Accordion.Header className={(errors?.phoneNumbers ? "accordeon-header-invalid" : "")} >{t("person.phones")}</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Row className="m-2 p-2">
                                <Col xs={12} className="p-1" >
                                    <PersonPhoneInfo />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="pt-2">
                        <Accordion.Header className={(errors?.contacts ? "accordeon-header-invalid" : "")}>{t("person.contacts")}</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Row className="m-2 p-2">
                                <Col xs={12} className="p-1" >
                                    <PersonEmergencyContactInfo isEditMode={isEditMode} />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
            <Row className="m-2 p-1">
                <Col xs={12} className="p-1">
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="person_info_input_note">{t("person.note")}</Form.Label>
                        <Form.Control as="textarea" id="person_info_input_note" rows={4} {...register("note")} />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}