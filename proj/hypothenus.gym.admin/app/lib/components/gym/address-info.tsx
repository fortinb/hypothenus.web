"use client"

import { Gym } from "@/src/lib/entities/gym";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function AddressInfo({ register, errors }: { register: UseFormRegister<Gym>, errors: FieldErrors<Gym> }) {

    return (
        <Container fluid="true">
            <Row className="gx-2">
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="address_input_civic_number" >Civic number</Form.Label>
                        <Form.Control type="input" id="address_input_civic_number" placeholder=""  {...register("address.civicNumber")}
                            className={errors?.address?.civicNumber ? "input-invalid" : ""} />
                        {errors.address?.civicNumber && <Form.Text className="text-invalid">{errors.address?.civicNumber?.message}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={8} >
                    <Form.Label className="text-primary" htmlFor="address_input_street_name" >Street name</Form.Label>
                    <Form.Control type="input" id="address_input_street_name" placeholder=""  {...register("address.streetName")}
                        className={errors?.address?.streetName ? "input-invalid" : ""} />
                    {errors.address?.streetName && <Form.Text className="text-invalid">{errors.address?.streetName?.message}</Form.Text>}
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="address_input_appartment" ># Appartment</Form.Label>
                        <Form.Control type="input" id="address_input_appartment" placeholder=""  {...register("address.appartment")}
                            className={errors?.address?.appartment ? "input-invalid" : ""} />
                        {errors.address?.appartment && <Form.Text className="text-invalid">{errors.address?.appartment?.message}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="gx-2 pt-2">
                <Col xs={8} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="address_input_city">City</Form.Label>
                        <Form.Control type="input" id="address_input_city" placeholder=""  {...register("address.city")}
                            className={errors?.address?.city ? "input-invalid" : ""} />
                        {errors.address?.city && <Form.Text className="text-invalid">{errors.address?.city?.message}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col xs={2} >
                    <Form.Label className="text-primary" htmlFor="address_input_state">Province</Form.Label>
                    <Form.Control type="input" id="address_input_state" placeholder=""  {...register("address.state")}
                        className={errors?.address?.state ? "input-invalid" : ""} />
                    {errors.address?.state && <Form.Text className="text-invalid">{errors.address?.state?.message}</Form.Text>}
                </Col>
                <Col xs={2} >
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="address_input_zipcode">Postal code</Form.Label>
                        <Form.Control type="input" id="address_input_zipcode" placeholder="A9A 9A9"  {...register("address.zipCode")}
                            className={(errors?.address?.zipCode ? "input-invalid" : "")} />
                        {errors.address?.zipCode && <Form.Text className="text-invalid">{errors.address?.zipCode?.message}</Form.Text>}
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}
