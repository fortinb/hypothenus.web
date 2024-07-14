"use client"

import { Address } from "@/src/lib/entities/address";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

export default function AddressInfo({ id, formStatefield }:
    {
        id: string,
        formStatefield: string
    }) {

    const { register, formState: { errors } } = useFormContext();

    function getError(): Merge<FieldError, FieldErrorsImpl<Address>> {
        return (errors?.address as unknown as Merge<FieldError, FieldErrorsImpl<Address>>);
    }

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_civic_number" + id }>Civic number</Form.Label>
                        <Form.Control type="input" id={"address_input_civic_number" + id }  {...register(formStatefield + ".civicNumber")}
                            className={getError()?.civicNumber ? "input-invalid" : ""} />
                        {getError()?.civicNumber && <Form.Text className="text-invalid">{getError()?.civicNumber?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={8} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_street" + id }>Street</Form.Label>
                        <Form.Control type="input" id={"address_input_street" + id }  {...register(formStatefield + ".streetName")}
                            className={getError()?.streetName ? "input-invalid" : ""} />
                        {getError()?.streetName && <Form.Text className="text-invalid">{getError()?.streetName?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_appartment" + id }># Appartment</Form.Label>
                        <Form.Control type="input" id={"address_input_appartment" + id }  {...register(formStatefield + ".appartment")}
                            className={getError()?.appartment ? "input-invalid" : ""} />
                        {getError()?.appartment && <Form.Text className="text-invalid">{getError()?.appartment?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="gx-2 pt-2">
                <Col xs={8} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_city" + id }>City</Form.Label>
                        <Form.Control type="input" id={"address_input_city" + id }  {...register(formStatefield + ".city")}
                            className={getError()?.city ? "input-invalid" : ""} />
                        {getError()?.city && <Form.Text className="text-invalid">{getError()?.city?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_state" + id }>Province</Form.Label>
                        <Form.Control type="input" id={"address_input_state" + id }  {...register(formStatefield + ".state")}
                            className={getError()?.state ? "input-invalid" : ""} />
                        {getError()?.state && <Form.Text className="text-invalid">{getError()?.state?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor={"address_input_zipcode" + id }>Postal code</Form.Label>
                        <Form.Control type="input" id={"address_input_zipcode" + id }  {...register(formStatefield + ".zipCode")}
                            className={getError()?.zipCode ? "input-invalid" : ""} />
                        {getError()?.zipCode && <Form.Text className="text-invalid">{getError()?.zipCode?.message ?? ""}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}