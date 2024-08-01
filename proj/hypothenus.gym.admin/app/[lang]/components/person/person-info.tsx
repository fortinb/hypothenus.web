"use client"

import i18n, { useTranslation } from "@/app/i18n/i18n";
import { Person } from "@/src/lib/entities/person";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";
import PersonAddressInfo from "./person-address-info";
import PersonEmergencyContactInfo from "./person-emergency-contact-info";
import PersonPhoneInfo from "./person-phone-info";
import Dropzone from 'react-dropzone'

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
                        <Form.Label className="text-primary" htmlFor={`person_input_lastname_${id}`}>{t("person.lastname")}</Form.Label>
                        <Form.Control type="input" id={`person_input_lastname_${id}`}  {...register(`${formStatefield}.lastname`)}
                            className={getError()?.lastname ? "input-invalid" : ""} />
                        {getError()?.lastname && <Form.Text className="text-invalid">{t(getError()?.lastname?.message ?? "")}</Form.Text>}
                    </Form.Group>

                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_dateOfBirth_${id}`}>{t("person.dateOfBirth")}</Form.Label>
                        <br />
                        <Controller
                            name={`${formStatefield}.dateOfBirth`}
                            render={({ field }) => (
                                <DatePicker id={`person_input_dateOfBirth_${id}`} selected={field.value} onChange={(date) => field.onChange(date)}
                                    className={"form-control "} locale={i18n.resolvedLanguage} dateFormat="yyyy-MM-dd" placeholderText={t("format.date")} />
                            )}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`person_input_photoUri_${id}`}>{t("person.photoUri")}</Form.Label>
                        <Dropzone disabled={!isEditMode} maxFiles={1} accept={{ "image/jpeg": [], "image/png": [] }} onDrop={acceptedFiles => console.log(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div className="dropzone"  {...getRootProps()}>
                                        <input  {...getInputProps()} />
                                        <div className="d-flex flex-column">
                                            <div className="d-flex flex-row justify-content-center align-items-center">
                                                <span className="dropzone-text m-0">Drag 'n' drop picture files here, or click to select</span>
                                            </div>
                                            <div className="d-flex flex-row justify-content-center align-items-center">
                                                <span className="m-0">*.jpg, *.png - max 2MB - 200x200</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </Dropzone>

                        <Form.Control type="input" id={`person_input_photoUri_${id}`}  {...register(`${formStatefield}.photoUri`)}
                            className={getError()?.photoUri ? "input-invalid" : ""} />
                        {getError()?.photoUri && <Form.Text className="text-invalid">{t(getError()?.photoUri?.message ?? "")}</Form.Text>}
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
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="person-communication-language-dropdown">{t("person.communicationLanguage")}</Form.Label>
                        <Form.Select id="person-communication-language-dropdown" {...register(`${formStatefield}.communicationLanguage`)}>
                            <option value="en">{t("language.en")}</option>
                            <option value="fr">{t("language.fr")}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="m-0 pt-2">
                <Accordion >
                    <Accordion.Item eventKey="0" className="pt-2">
                        <Accordion.Header className={(getError()?.address ? "accordeon-header-invalid" : "")}>{t("person.address")}</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Row className="m-2 p-2">
                                <Col xs={12} className="p-1" >
                                    <PersonAddressInfo />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="pt-2">
                        <Accordion.Header className={(getError()?.phoneNumbers ? "accordeon-header-invalid" : "")} >{t("person.phones")}</Accordion.Header>
                        <Accordion.Body className="p-0">
                            <Row className="m-2 p-2">
                                <Col xs={12} className="p-1" >
                                    <PersonPhoneInfo />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="pt-2">
                        <Accordion.Header className={(getError()?.contacts ? "accordeon-header-invalid" : "")}>{t("person.contacts")}</Accordion.Header>
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
                        <Form.Control as="textarea" id="person_info_input_note" rows={4} {...register(`${formStatefield}.note`)} />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}