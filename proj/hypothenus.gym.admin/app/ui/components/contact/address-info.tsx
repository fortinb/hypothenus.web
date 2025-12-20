"use client"

import { useTranslations } from "next-intl";
import { getParentErrorField } from "@/app/lib/forms/errorsUtils";
import { Address } from "@/src/lib/entities/address";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

export default function AddressInfo({ id, formStatefield, parent }:
    {
        id: string,
        formStatefield: string,
        parent?: string
    }) {
    const t = useTranslations("entity");
    const { register, formState: { errors } } = useFormContext();

    function getError(): Merge<FieldError, FieldErrorsImpl<Address>> {
        const parentErrorField: any = getParentErrorField(errors, parent);
        return (parentErrorField?.address as Merge<FieldError, FieldErrorsImpl<Address>>);
    }
   
    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_civic_number_${id}`}>{t("address.civicNumber")}</Form.Label>
                        <Form.Control type="input" id={`address_input_civic_number_${id}`}  {...register(`${formStatefield}.civicNumber`)}
                            className={getError()?.civicNumber ? "input-invalid" : ""} />
                        {getError()?.civicNumber && <Form.Text className="text-invalid">{t(getError()?.civicNumber?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={8} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_street_${id}`}>{t("address.street")}</Form.Label>
                        <Form.Control type="input" id={`address_input_street_${id}`}  {...register(`${formStatefield}.streetName`)}
                            className={getError()?.streetName ? "input-invalid" : ""} />
                        {getError()?.streetName && <Form.Text className="text-invalid">{t(getError()?.streetName?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_appartment_${id}`}>{t("address.appartment")}</Form.Label>
                        <Form.Control type="input" id={`address_input_appartment_${id}`}  {...register(`${formStatefield}.appartment`)}
                            className={getError()?.appartment ? "input-invalid" : ""} />
                        {getError()?.appartment && <Form.Text className="text-invalid">{t(getError()?.appartment?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="gx-2 pt-2">
                <Col xs={8} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_city_${id}`}>{t("address.city")}</Form.Label>
                        <Form.Control type="input" id={`address_input_city_${id}`}  {...register(`${formStatefield}.city`)}
                            className={getError()?.city ? "input-invalid" : ""} />
                        {getError()?.city && <Form.Text className="text-invalid">{t(getError()?.city?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_state_${id}`}>{t("address.state")}</Form.Label>
                        <Form.Control type="input" id={`address_input_state_${id}`}  {...register(`${formStatefield}.state`)}
                            className={getError()?.state ? "input-invalid" : ""} />
                        {getError()?.state && <Form.Text className="text-invalid">{t(getError()?.state?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={`address_input_zipcode_${id}`}>{t("address.zipcode")}</Form.Label>
                        <Form.Control type="input" id={`address_input_zipcode_${id}`}  {...register(`${formStatefield}.zipCode`)}
                            className={getError()?.zipCode ? "input-invalid" : ""} />
                        {getError()?.zipCode && <Form.Text className="text-invalid">{t(getError()?.zipCode?.message ?? "")}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}