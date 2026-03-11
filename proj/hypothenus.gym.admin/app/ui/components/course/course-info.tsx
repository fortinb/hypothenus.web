"use client"

import { Course } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import moment from "moment";
import LocalizedStringInfo from "../localized/localized-string-info";
import { useTranslations } from "next-intl";
import "@/app/lib/i18n/datepicker-locales";
import { localesConfig } from "@/i18n/locales-client";
import FormLabelRequired from "../forms/form-label-required";

export default function CourseInfo({ lang, course, isEditMode, isCancelling }:
    {
        lang: string,
        course: Course,
        isEditMode: boolean,
        isCancelling: boolean
    }) {
    const { register, formState: { errors } } = useFormContext();
    const t = useTranslations("entity");

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="course_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={4} >
                        <Form.Group>
                            <FormLabelRequired className="text-primary" htmlFor="course_info_input_code" required={true} label={t("course.code")}></FormLabelRequired>
                            <Form.Control type="input" id="course_info_input_code" placeholder={t("course.codePlaceholder")} {...register("code")}
                                className={errors.code ? "input-invalid" : ""} disabled={(course.uuid !== null ? true : false)} />
                            {errors.code && <Form.Text className="text-invalid">{t(errors.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Accordion >
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={errors.name || errors.description ? "accordeon-header-invalid" : ""}>{t("course.descriptions")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        {localesConfig.locales.map((language: string, index: number) => {
                                            return (
                                                <div key={language}>
                                                    <Row className="m-2 gx-2">
                                                        <hr />
                                                        <Form.Label className="text-primary h5" >{t(`language.${language}`)}</Form.Label>
                                                    </Row>
                                                    <Row className="m-2 gx-2">
                                                        <Col xs={4} >
                                                            <Form.Group>
                                                                <FormLabelRequired className="text-primary" required={true} htmlFor={`course_info_input_name_${index}`} label={t("course.name")}></FormLabelRequired>
                                                                <LocalizedStringInfo key={index} index={index} id={`course_info_input_name_${index}`} nbRows={1} language={language as LanguageEnum} formStatefield={`name.${index}`} parent="name"></LocalizedStringInfo>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={8} >
                                                            <Form.Group>
                                                                <FormLabelRequired className="text-primary" required={true} htmlFor={`course_info_input_description_${index}`} label={t("course.description")}></FormLabelRequired>
                                                                <LocalizedStringInfo key={index} index={index} id={`course_info_input_description_${index}`} nbRows={2} language={language as LanguageEnum} formStatefield={`description.${index}`} parent="description"></LocalizedStringInfo>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="pt-2">
                            <Accordion.Header className={(errors.startDate || errors.endDate ? "accordeon-header-invalid" : "")}>{t("course.datesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <FormLabelRequired className="text-primary" required={true} htmlFor={`course_input_startDate`} label={t("course.startDate")}></FormLabelRequired>
                                            <br />
                                            <Controller
                                                name={`startDate`}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        className={"form-control " + (errors.startDate ? " input-invalid " : "")}
                                                        id={`course_input_startDate`}
                                                        minDate={new Date()}
                                                        onChange={(date: Date | null) => field.onChange(date ? date.toISOString() : null)}
                                                        selected={!field.value ? null : moment(field.value).toDate()}
                                                        locale={lang}
                                                        dateFormat="yyyy-MM-dd"
                                                        placeholderText={t("format.date")}
                                                    />
                                                )}
                                            />
                                            <br />
                                            {errors.startDate && <Form.Text className="text-invalid">{t(errors.startDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <Form.Label className="text-primary" htmlFor={`course_input_endDate`}>{t("course.endDate")}</Form.Label>
                                            <br />
                                            <Controller
                                                name={"endDate"}
                                                render={({ field }) => (
                                                    <DatePicker 
                                                        id={`course_input_endDate`} 
                                                        minDate={new Date()} 
                                                        onChange={(date: Date | null) => field.onChange(date ? date.toISOString() : null)}
                                                        selected={!field.value ? null : moment(field.value).toDate()}
                                                        className={"form-control " + (errors.endDate ? " input-invalid " : "")} 
                                                        locale={lang} 
                                                        dateFormat="yyyy-MM-dd" 
                                                        placeholderText={t("format.date")} />
                                                )}
                                            />
                                            <br />
                                            {errors.endDate && <Form.Text className="text-invalid">{t(errors.endDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
            </Container>
        </fieldset>
    );
}