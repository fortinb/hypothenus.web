"use client"

import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "@/app/i18n/i18n";
import BrandAddressInfo from "./brand-address-info";
import BrandPhoneInfo from "./brand-phone-info";
import BrandContactInfo from "./brand-contact-info";

export default function BrandInfo({ brand, isEditMode }:
    {
        brand: any,
        isEditMode: boolean
    }) {
    const { register, formState: { errors } } = useFormContext();
    const { t } = useTranslation("entity");

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="brand_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="brand_info_input_code">{t("brand.code")}</Form.Label>
                            <Form.Control type="input" id="brand_info_input_code" placeholder={t("brand.codePlaceholder")} {...register("brandId")}
                                className={errors.brandId ? "input-invalid" : ""}
                                disabled={(brand?.brandId ? true : false)} />
                            {errors.brandId && <Form.Text className="text-invalid">{t(errors.brandId.message as string)}</Form.Text>}
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
