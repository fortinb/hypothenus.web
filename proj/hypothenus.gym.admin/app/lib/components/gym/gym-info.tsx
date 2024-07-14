"use client"

import { Gym } from "@/src/lib/entities/gym";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import GymAddressInfo from "./gym-address-info";
import GymContactInfo from "./gym-contact-info";
import GymPhoneInfo from "./gym-phone-info";

export default function GymInfo({ gym, isEditMode }:
    {
        gym: Gym,
        isEditMode: boolean
    }) {

    const { register, formState: {errors} } = useFormContext();

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="gym_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_code">Code</Form.Label>
                            <Form.Control type="input" id="gym_info_input_code" placeholder="Gym unique code" {...register("gymId")}
                                className={errors.gymId ? "input-invalid" : ""}
                                disabled={(gym.gymId !== "" ? true : false)} />
                            {errors.gymId && <Form.Text className="text-invalid">{errors.gymId.message as string}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_name">Name</Form.Label>
                            <Form.Control autoFocus={isEditMode} type="input" id="gym_info_input_name" placeholder=""  {...register("name")}
                                className={errors.name ? "input-invalid" : ""} />
                            {errors.name && <Form.Text className="text-invalid">{errors.name.message as string}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_email">Email address</Form.Label>
                            <Form.Control type="input" id="gym_info_input_email" placeholder="example@email.ca" {...register("email")}
                                className={errors.email ? "input-invalid" : ""} />
                            {errors.email && <Form.Text className="text-invalid">{errors.email.message as string}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1" >
                        <GymAddressInfo />
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1" >
                        <GymPhoneInfo />
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1" >
                        <GymContactInfo />
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1">
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_note">Notes</Form.Label>
                            <Form.Control as="textarea" id="gym_info_input_note" rows={4} {...register("note")} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </fieldset>
    );
}