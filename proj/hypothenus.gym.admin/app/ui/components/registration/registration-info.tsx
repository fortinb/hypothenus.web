"use client"

import { useTranslations } from "next-intl";
import { Person } from "@/src/lib/entities/person";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";
import { useParams } from "next/navigation";
import moment from "moment";
import "@/app/lib/i18n/datepicker-locales";
import FormLabelRequired from "../forms/form-label-required";
import RegistrationPhoneInfo from "./registration-phone-info";
import { localesConfig } from "@/i18n/locales-client";

export default function RegistrationInfo({ id, formStatefield }:
    {
        id: string,
        formStatefield: string
    }) {

    const t = useTranslations("entity");
    const params = useParams<{ lang: string }>();
    const { register, formState: { errors } } = useFormContext();

    function getError(): Merge<FieldError, FieldErrorsImpl<Person>> {
        return (errors?.person as unknown as Merge<FieldError, FieldErrorsImpl<Person>>);
    }

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <FormLabelRequired className="text-primary" htmlFor={`person_input_firstname_${id}`} label={t("person.firstname")}></FormLabelRequired>
                        <Form.Control type="input" id={`person_input_firstname_${id}`}  {...register(`${formStatefield}.firstname`)}
                            className={getError()?.firstname ? "input-invalid" : ""} />
                        {getError()?.firstname && <Form.Text className="text-invalid">{t(getError()?.firstname?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <FormLabelRequired className="text-primary" htmlFor={`person_input_lastname_${id}`} label={t("person.lastname")}></FormLabelRequired>
                        <Form.Control type="input" id={`person_input_lastname_${id}`}  {...register(`${formStatefield}.lastname`)}
                            className={getError()?.lastname ? "input-invalid" : ""} />
                        {getError()?.lastname && <Form.Text className="text-invalid">{t(getError()?.lastname?.message ?? "")}</Form.Text>}
                    </Form.Group>

                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <FormLabelRequired className="text-primary" htmlFor={`person_input_dateOfBirth_${id}`} label={t("person.dateOfBirth")}></FormLabelRequired>
                        <br />
                        <Controller
                            name={`${formStatefield}.dateOfBirth`}
                            render={({ field }) => (
                                <DatePicker
                                    id={`person_input_dateOfBirth_${id}`}
                                    selected={!field.value ? null : moment(field.value).toDate()}
                                    onChange={(date: Date | null) => field.onChange(date?.toISOString())}
                                    className={"form-control "}
                                    locale={params.lang}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText={t("format.date")} />
                            )}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <FormLabelRequired className="text-primary" htmlFor={`person-communication-language-dropdown_${id}`} label={t("person.communicationLanguage")}></FormLabelRequired>
                        <Form.Select id={`person-communication-language-dropdown_${id}`} {...register(`${formStatefield}.communicationLanguage`)}>
                             {localesConfig.locales.map((lang: string, index: number) => {
                                return <option key={index} value={`${lang}`} selected={params.lang === `${lang}`}>{t(`language.${lang}`)}</option>
                             })}     
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <FormLabelRequired className="text-primary" htmlFor={`person_input_email_${id}`} label={t("person.email")}></FormLabelRequired>
                        <Form.Control type="input" id={`person_info_input_email_${id}`} placeholder={t("person.emailPlaceholder")} {...register(`${formStatefield}.email`)}
                            className={getError()?.email ? "input-invalid" : ""} />
                        {getError()?.email && <Form.Text className="text-invalid">{t(getError()?.email?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} className="p-1" >
                    <RegistrationPhoneInfo />
                </Col>
            </Row>
        </Container>
    );
}