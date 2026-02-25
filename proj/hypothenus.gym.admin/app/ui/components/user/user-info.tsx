"use client"

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import Form from "react-bootstrap/Form";
import FormLabelRequired from "../forms/form-label-required";
import Select from "react-select";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { RoleSelectedItem } from "@/src/lib/entities/ui/role-selected-item";
import { UserFormData } from "@/app/[lang]/admin/users/[userId]/user-form";

export default function UserInfo({ availableRoleItems: availableRoleItems, formRolesStateField, isEditMode, isCancelling }:
    {
        availableRoleItems: RoleSelectedItem[],
        isEditMode: boolean,
        isCancelling: boolean,
        formRolesStateField: string
    }) {
    const { register, formState: { errors } } = useFormContext<UserFormData>();
    const t = useTranslations("entity");

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="user_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor={`user_input_firstname`} label={t("user.firstname")}></FormLabelRequired>
                            <Form.Control type="input" id={`user_input_firstname`}  {...register(`user.firstname`)}
                                className={errors.user?.firstname ? "input-invalid" : ""} />
                            {errors.user?.firstname && <Form.Text className="text-invalid">{t(errors.user?.firstname.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor={`user_input_lastname`} label={t("user.lastname")}></FormLabelRequired>
                            <Form.Control type="input" id={`user_input_lastname`}  {...register(`user.lastname`)}
                                className={errors.user?.lastname ? "input-invalid" : ""} />
                            {errors.user?.lastname && <Form.Text className="text-invalid">{t(errors.user?.lastname.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor={`user_input_email`} label={t("user.email")}></FormLabelRequired>
                            <Form.Control type="input" id={`user_input_email`} placeholder={`${t("user.emailPlaceholder")}`} {...register(`user.email`)}
                                className={errors.user?.email ? "input-invalid" : ""} />
                            {errors.user?.email && <Form.Text className="text-invalid">{t(errors.user?.email.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                    </Col>
                </Row>
                <Row className="m-2 p-2">
                    <Col xs={12} className="p-1" >
                        <FormLabelRequired className="text-primary" htmlFor={`user_input_roles`} label={t("user.roles.title")}></FormLabelRequired>
                        <Controller
                            name={`${formRolesStateField}`}
                            render={({ field }) => (
                                <div>
                                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_user_info_role_add_all_tooltip">{t("user.roles.addAll")}</Tooltip>}>
                                        <Button className="btn btn-icon btn-sm mb-2" disabled={!isEditMode} onClick={() => field.onChange(availableRoleItems)}><i className="icon icon-light bi bi-chevron-double-right h7"></i></Button>
                                    </OverlayTrigger>
                                    <Select
                                        {...field}
                                        isMulti={true}
                                        options={availableRoleItems}
                                        onChange={(selected) => field.onChange(selected)}
                                        value={field.value}
                                        hideSelectedOptions={true}
                                        closeMenuOnSelect={false}
                                        isDisabled={!isEditMode}
                                        placeholder={t("user.roles.selected")}
                                        noOptionsMessage={() => t("user.roles.selected")}
                                        classNames={{
                                            multiValueRemove: () => "select-multi-remove"
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </Col>
                </Row>
            </Container>
        </fieldset>
    );
}
