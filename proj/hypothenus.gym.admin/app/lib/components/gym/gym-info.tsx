"use client"

import { Gym } from "@/src/lib/entities/gym";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import AddressInfo from "./address-info";
import PhoneInfo from "./phone-info";

export default function GymInfo({ gym, register, errors, isEditMode }:
    {
        gym: Gym,
        register: UseFormRegister<Gym>,
        errors: FieldErrors<Gym>,
        isEditMode: boolean
    }) {

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
                            {errors.gymId && <Form.Text className="text-invalid">{errors.gymId.message}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_name">Name</Form.Label>
                            <Form.Control autoFocus={isEditMode} type="input" id="gym_info_input_name" placeholder=""  {...register("name")}
                                className={errors.name ? "input-invalid" : ""} />
                            {errors.name && <Form.Text className="text-invalid">{errors.name.message}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_email">Email address</Form.Label>
                            <Form.Control type="input" id="gym_info_input_email" placeholder="example@email.ca" {...register("email")}
                                className={errors.email ? "input-invalid" : ""} />
                            {errors.email && <Form.Text className="text-invalid">{errors.email.message}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1" >
                        <AddressInfo register={register} errors={errors} />
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1" >
                        <PhoneInfo register={register} errors={errors} />
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
/*
 <div className="d-flex flex-row justify-content-start">
                <div className="col-6 m-2 pe-3">
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="gym_info_input_code">Code</Form.Label>
                        <Form.Control type="input" id="gym_info_input_code" placeholder="Gym unique code" {...register("gymId")}
                            className={errors.gymId ? "input-invalid" : ""}
                            disabled={(gym.gymId !== "" ? true : false)} />
                        {errors.gymId && <Form.Text className="text-invalid">{errors.gymId.message}</Form.Text>}
                    </Form.Group>
                </div>
            </div>
            <div className="d-flex flex-row justify-content-start">
                <div className="col-6 p-2">
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="gym_info_input_name">Name</Form.Label>
                        <Form.Control autoFocus={isEditMode} type="input" id="gym_info_input_name" placeholder=""  {...register("name")}
                            className={errors.name ? "input-invalid" : ""} />
                        {errors.name && <Form.Text className="text-invalid">{errors.name.message}</Form.Text>}
                    </Form.Group>
                </div>
                <div className="col-6 p-2">
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="gym_info_input_email">Email address</Form.Label>
                        <Form.Control type="input" id="gym_info_input_email" placeholder="example@email.ca" {...register("email")}
                            className={errors.email ? "input-invalid" : ""} />
                        {errors.email && <Form.Text className="text-invalid">{errors.email.message}</Form.Text>}
                    </Form.Group>
                </div>
            </div>
            <div className="d-flex flex-row justify-content-start">
                <div className="col-12">
                    <AddressInfo register={register} errors={errors} />
                </div>
            </div>
            <div className="d-flex flex-row justify-content-start">
                <div className="col-12">
                    <PhoneInfo register={register} errors={errors} />
                </div>
            </div>
            <div className="d-flex flex-row justify-content-start">
                <div className="col-12 p-2">
                    <Form.Group>
                        <Form.Label className="text-primary" htmlFor="gym_info_input_note">Notes</Form.Label>
                        <Form.Control as="textarea" id="gym_info_input_note" rows={4} {...register("note")} />
                    </Form.Group>
                </div>
            </div>
        </fieldset>
*/