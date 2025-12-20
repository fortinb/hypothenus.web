"use client"

import { Contact } from "@/src/lib/entities/contact";
import { PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";
import PhoneNumberInfo from "./phone-number-info";
import { useTranslations } from "next-intl";
import { getParentErrorField } from "@/app/lib/forms/errorsUtils";

export default function ContactInfo({ index, id, formStatefield, parent }:
    {
        index: number,
        id: string,
        formStatefield: string,
        parent?: string
    }) {
    const t = useTranslations("entity");
    const { register, formState: { errors } } = useFormContext();

    function getError(index: number): Merge<FieldError, FieldErrorsImpl<Contact>> {
        const parentErrorField: any = getParentErrorField(errors, parent);
        return (parentErrorField?.contacts as Merge<FieldError, FieldErrorsImpl<Contact>>[])?.[index];
    }

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`contact_input_firstname_${id}_${index}`}>{t("person.firstname")}</Form.Label>
                        <Form.Control type="input" id={`contact_input_firstname_${id}_${index}`}  {...register(`${formStatefield}.firstname`)}
                            className={getError(index)?.firstname ? "input-invalid" : ""} />
                        {getError(index)?.firstname && <Form.Text className="text-invalid">{t(getError(index)?.firstname?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`contact_input_lastname_${id}_${index}`}>{t("person.lastname")}</Form.Label>
                        <Form.Control type="input" id={`contact_input_lastname_${id}_${index}`}  {...register(`${formStatefield}.lastname`)}
                            className={getError(index)?.lastname ? "input-invalid" : ""} />
                        {getError(index)?.lastname && <Form.Text className="text-invalid">{t(getError(index)?.lastname?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`contact_input_description_${id}_${index}`}>{t("person.description")}</Form.Label>
                        <Form.Control type="input" id={`contact_input_description_${id}_${index}`}  {...register(`${formStatefield}.description`)}
                            className={getError(index)?.description ? "input-invalid" : ""} />
                        {getError(index)?.description && <Form.Text className="text-invalid">{t(getError(index)?.description?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={6} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`contact_input_email_${id}_${index}`}>{t("person.email")}</Form.Label>
                        <Form.Control type="input" id={`contact_input_email_${id}_${index}`} placeholder="example@email.ca" {...register(`${formStatefield}.email`)}
                            className={getError(index)?.email ? "input-invalid" : ""} />
                        {getError(index)?.email && <Form.Text className="text-invalid">{t(getError(index)?.email?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-2 gx-2">
                <Col xs={4} >
                    <PhoneNumberInfo index={0} id={`contact_phone_${id}_0`} defaultType={PhoneNumberTypeEnum.Home} formStatefield={`${formStatefield}.phoneNumbers.0`} parent={formStatefield} />
                </Col>
                <Col xs={4} >
                    <PhoneNumberInfo index={1} id={`contact_phone_${id}_1`} defaultType={PhoneNumberTypeEnum.Mobile} formStatefield={`${formStatefield}.phoneNumbers.1`} parent={formStatefield} />
                </Col>
            </Row>
        </Container>
    );
}