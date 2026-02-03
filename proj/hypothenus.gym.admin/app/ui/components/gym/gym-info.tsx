"use client"

import { Gym } from "@/src/lib/entities/gym";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import GymAddressInfo from "./gym-address-info";
import GymContactInfo from "./gym-contact-info";
import GymPhoneInfo from "./gym-phone-info";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone'
import Image from "next/image";
import { Controller } from "react-hook-form";
import FormLabelRequired from "../forms/form-label-required";

export default function GymInfo({ gym, isEditMode, isCancelling, uploadHandler }:
    {
        gym: Gym,
        isEditMode: boolean,
        isCancelling: boolean,
        uploadHandler: (file: Blob) => void
    }) {
    const { register, formState: { errors } } = useFormContext();
    const t = useTranslations("entity");
    const [logoPreviewUri, setLogoPreviewUri] = useState<string>();

    useEffect(() => {
        if (isCancelling === true) {
            setLogoPreviewUri(undefined);
        }

    }, [isCancelling, logoPreviewUri]);

    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[], e: DropEvent) => {
        acceptedFiles.forEach((file: Blob) => {
            let imageUrl = URL.createObjectURL(file);
            setLogoPreviewUri(imageUrl);
            uploadHandler(file);
        })
    };

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="gym_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor="gym_info_input_code" label={t("gym.code")}></FormLabelRequired>
                            <Form.Control type="input" id="gym_info_input_code" placeholder={t("gym.codePlaceholder")} {...register("code")}
                                className={errors.gymId ? "input-invalid" : ""}
                                disabled={(gym?.code ? true : false)} />
                            {errors.code && <Form.Text className="text-invalid">{t(errors.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group >
                            <Form.Label className="text-primary" htmlFor={`gym_input_logoUri`}>{t("gym.logoUri")}</Form.Label>
                            {isEditMode &&
                                <Dropzone disabled={!isEditMode} maxFiles={1} accept={{ "image/jpeg": [], "image/png": [] }} onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div className="dropzone"  {...getRootProps()}>
                                                <input  {...getInputProps()} />
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex flex-row justify-content-center align-items-center">
                                                        <span className="dropzone-text ms-2 me-2"> {t("gym.image.dropzone")}</span>
                                                    </div>
                                                    <div className="d-flex flex-row justify-content-center align-items-center">
                                                        <span className="m-0">{t("gym.image.attributes")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            }
                            <div className="d-flex flex-row justify-content-center mt-2">
                                <Form.Control type="hidden" id={`gym_input_logoContent`}  {...register("logoContent")} />
                                <Controller
                                    name={"logoUri"}
                                    render={({ field }) => (
                                        <Image
                                            src={logoPreviewUri ? logoPreviewUri : (URL.canParse(field.value) ? field.value : "/images/defaultLogo.png")}
                                            width={200}
                                            height={200}
                                            alt={t("gym.logoAlt")}
                                            onError={() => {
                                                // if preview was set but failed to load, clear it so default will be used
                                                if (logoPreviewUri) {
                                                    setLogoPreviewUri(undefined);
                                                }
                                            }}
                                        />
                                    )}

                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor="gym_info_input_name" label={t("gym.name")}></FormLabelRequired>
                            <Form.Control autoFocus={isEditMode} type="input" id="gym_info_input_name" placeholder=""  {...register("name")}
                                className={errors.name ? "input-invalid" : ""} />
                            {errors.name && <Form.Text className="text-invalid">{t(errors.name.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_email">{t("gym.email")}</Form.Label>
                            <Form.Control type="input" id="gym_info_input_email" placeholder="example@email.ca" {...register("email")}
                                className={errors.email ? "input-invalid" : ""} />
                            {errors.email && <Form.Text className="text-invalid">{t(errors.email.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-0 pt-2">
                    <Accordion >
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={(errors?.address ? "accordeon-header-invalid" : "")}>{t("gym.address")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <GymAddressInfo />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="pt-2">
                            <Accordion.Header className={(errors?.phoneNumbers ? "accordeon-header-invalid" : "")} >{t("gym.phones")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <GymPhoneInfo />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="pt-2">
                            <Accordion.Header className={(errors?.contacts ? "accordeon-header-invalid" : "")}>{t("gym.contacts")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <GymContactInfo isEditMode={isEditMode} />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1">
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="gym_info_input_note">{t("gym.note")}</Form.Label>
                            <Form.Control as="textarea" id="gym_info_input_note" rows={4} {...register("note")} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 p-1">
                    
                </Row>
            </Container>
        </fieldset>
    );
}