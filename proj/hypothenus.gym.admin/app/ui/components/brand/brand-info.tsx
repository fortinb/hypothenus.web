"use client"

import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import BrandAddressInfo from "./brand-address-info";
import BrandPhoneInfo from "./brand-phone-info";
import BrandContactInfo from "./brand-contact-info";
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone'
import Image from "next/image";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

export default function BrandInfo({ brand, isEditMode, isCancelling, uploadHandler }:
    {
        brand: any,
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
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="brand_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="brand_info_input_code">{t("brand.code")}</Form.Label>
                            <Form.Control type="input" id="brand_info_input_code" placeholder={t("brand.codePlaceholder")} {...register("code")}
                                className={errors.code ? "input-invalid" : ""}
                                disabled={(brand?.code ? true : false)} />
                            {errors.code && <Form.Text className="text-invalid">{t(errors.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group >
                            <Form.Label className="text-primary" htmlFor={`brand_input_logoUri`}>{t("brand.logoUri")}</Form.Label>
                            {isEditMode &&
                                <Dropzone disabled={!isEditMode} maxFiles={1} accept={{ "image/jpeg": [], "image/png": [] }} onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div className="dropzone"  {...getRootProps()}>
                                                <input  {...getInputProps()} />
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex flex-row justify-content-center align-items-center">
                                                        <span className="dropzone-text ms-2 me-2"> {t("brand.image.dropzone")}</span>
                                                    </div>
                                                    <div className="d-flex flex-row justify-content-center align-items-center">
                                                        <span className="m-0">{t("brand.image.attributes")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            }
                            <div className="d-flex flex-row justify-content-center mt-2">
                                <Form.Control type="hidden" id={`brand_input_logoContent`}  {...register("logoContent")} />
                                <Controller
                                    name={"logoUri"}
                                    render={({ field }) => (
                                        <Image
                                            src={logoPreviewUri ? logoPreviewUri : (URL.canParse(field.value) ? field.value : "/images/defaultLogo.png")}
                                            width={200}
                                            height={200}
                                            alt={t("brand.logoAlt")}
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
                            <Form.Label className="text-primary" htmlFor="brand_info_input_name">{t("brand.name")}</Form.Label>
                            <Form.Control autoFocus={isEditMode} type="input" id="brand_info_input_name" placeholder=""  {...register("name")}
                                className={errors.name ? "input-invalid" : ""} />
                            {errors.name && <Form.Text className="text-invalid">{t(errors.name.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="brand_info_input_email">{t("brand.email")}</Form.Label>
                            <Form.Control type="input" id="brand_info_input_email" placeholder="" {...register("email")}
                                className={errors.email ? "input-invalid" : ""} />
                            {errors.email && <Form.Text className="text-invalid">{t(errors.email.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-0 pt-2">
                    <Accordion >
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={(errors?.address ? "accordeon-header-invalid" : "")}>{t("brand.address")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <BrandAddressInfo />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="pt-2">
                            <Accordion.Header className={(errors?.phoneNumbers ? "accordeon-header-invalid" : "")}>{t("brand.phones")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <BrandPhoneInfo />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="pt-2">
                            <Accordion.Header className={(errors?.contacts ? "accordeon-header-invalid" : "")}>{t("brand.contacts")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <BrandContactInfo isEditMode={isEditMode} />
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
                <Row className="m-2 p-1">
                    <Col xs={12} className="p-1">
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="brand_info_input_note">{t("brand.note")}</Form.Label>
                            <Form.Control as="textarea" id="brand_info_input_note" rows={4} {...register("note")} />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </fieldset>
    );
}
