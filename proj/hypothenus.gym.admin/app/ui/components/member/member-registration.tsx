"use client"

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import FormLabelRequired from "../forms/form-label-required";
import RegistrationInfo from "../registration/registration-info";
import { useState } from "react";

export default function MemberRegistration({ availableGymItems }:
    {
        availableGymItems: GymListItem[]
    }) {

    const t = useTranslations("entity");
    const { register, formState: { errors } } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="member_info_form" disabled={false} >
            <Container >
                <Row className="m-2 gx-2">
                    <RegistrationInfo id="member_person" formStatefield="person"></RegistrationInfo>
                </Row>
                <Row className="m-2 gx-2">
                    <Col xs={6}  >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor="member-preferred-gym-dropdown" label={t("member.preferredGym")}></FormLabelRequired>
                            <Form.Select id="member-preferred-gym-dropdown" defaultValue={availableGymItems.length > 0 ? availableGymItems[0].value : ""} {...register(`preferredGymUuid`)}>
                                {availableGymItems.map((gym) => (
                                    <option key={gym.value} value={gym.value}>{gym.label}</option>
                                ))}
                            </Form.Select>
                            {errors?.preferredGymUuid && <Form.Text className="text-invalid">{t(errors.preferredGymUuid.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} className="gx-2">
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Col xs={6} className="gx-2">
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor={`input_password_1`} label={t("member.password")}></FormLabelRequired>
                            <Form.Control type={showPassword ? "text" : "password"} id={`person_info_input_password_1`}  {...register(`password`)}
                                className={errors?.password ? "input-invalid" : ""} />
                                <i className={`ms-2 bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle-icon`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: "pointer" }}></i>
                            {errors?.password && <Form.Text className="text-invalid">{t(errors?.password?.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} className="gx-2">
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor={`input_password_confirmation`} label={t("member.passwordConfirmation")}></FormLabelRequired>
                            <Form.Control type={showPasswordConfirmation ? "text" : "password"} id={`person_info_input_password_confirmation`} {...register(`passwordConfirmation`)}
                                className={errors?.passwordConfirmation ? "input-invalid" : ""}/> 
                                <i className={`ms-2 bi ${showPasswordConfirmation ? "bi-eye-slash" : "bi-eye"} password-toggle-icon`}
                                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                                    style={{ cursor: "pointer" }}
                            ></i>
                            {errors?.passwordConfirmation && <Form.Text className="text-invalid">{t(errors?.passwordConfirmation?.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </fieldset>
    );
}