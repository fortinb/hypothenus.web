"use client"

import { Course } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { Coach } from "@/src/lib/entities/coach";
import moment from "moment";
import { CourseFormData } from "@/app/[lang]/brands/[brandId]/gyms/[gymId]/courses/[courseId]/course-form";
import LocalizedStringInfo from "../localized/localized-string-info";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/lib/i18n/datepicker-locales"; 

export interface SelectItem {
    coach: Coach;
    label: string;
    value: string;
}

export default function CourseInfo({ course, availableCoachItems, formCoachsStateField, isEditMode, isCancelling }:
    {
        course: Course,
        availableCoachItems: SelectItem[],
        formCoachsStateField: string,
        isEditMode: boolean,
        isCancelling: boolean
    }) {
    const { register, formState: { errors } } = useFormContext<CourseFormData>();
    const params = useParams<{ lang: string }>();
    const t = useTranslations("entity");

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="course_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={4} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="course_info_input_code">{t("course.code")}</Form.Label>
                            <Form.Control type="input" id="course_info_input_code" placeholder={t("course.codePlaceholder")} {...register("course.code")}
                                className={errors.course?.code ? "input-invalid" : ""} disabled={(course.id !== null ? true : false)} />
                            {errors.course?.code && <Form.Text className="text-invalid">{t(errors.course?.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Accordion >
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={errors.course?.name || errors.course?.description ? "accordeon-header-invalid" : ""}>{t("course.description")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        {routing.locales.map((language: string, index: number) => {
                                            return (
                                                <div key={language}>
                                                    <Row className="m-2 gx-2">
                                                        <hr />
                                                        <Form.Label className="text-primary h5" >{t(`language.${language}`)}</Form.Label>
                                                    </Row>
                                                    <Row className="m-2 gx-2">
                                                        <Col xs={4} >
                                                            <Form.Group>
                                                                <Form.Label className="text-primary" htmlFor={`course_info_input_name_${index}`}>{t("course.name")}</Form.Label>
                                                                <LocalizedStringInfo key={index} index={index} id={`course_info_input_name_${index}`} nbRows={1} language={language as LanguageEnum} formStatefield={`course.name.${index}`} parent="course.name"></LocalizedStringInfo>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={8} >
                                                            <Form.Group>
                                                                <Form.Label className="text-primary" htmlFor={`course_info_input_description_${index}`}>{t("course.description")}</Form.Label>
                                                                <LocalizedStringInfo key={index} index={index} id={`course_info_input_description_${index}`} nbRows={2} language={language as LanguageEnum} formStatefield={`course.description.${index}`} parent="course.description"></LocalizedStringInfo>
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
                            <Accordion.Header className={(errors.course?.startDate || errors.course?.endDate ? "accordeon-header-invalid" : "")}>{t("course.datesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <Form.Label className="text-primary" htmlFor={`course_input_startDate`}>{t("course.startDate")}</Form.Label>
                                            <br />
                                            <Controller
                                                name={`course.startDate`}
                                                render={({ field }) => (
                                                    <DatePicker className={"form-control " + (errors.course?.startDate ? " input-invalid " : "")} id={`course_input_startDate`} minDate={new Date()} selected={moment(field.value).toDate()} onChange={(date) => field.onChange(date?.toISOString())}
                                                        locale={params.lang} dateFormat="yyyy-MM-dd" placeholderText={t("format.date")} />
                                                )}
                                            />
                                            <br />
                                            {errors.course?.startDate && <Form.Text className="text-invalid">{t(errors.course?.startDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <Form.Label className="text-primary" htmlFor={`course_input_endDate`}>{t("course.endDate")}</Form.Label>
                                            <br />
                                            <Controller
                                                name={"course.endDate"}
                                                render={({ field }) => (
                                                    <DatePicker id={`course_input_endDate`} minDate={new Date()} onChange={(date) => field.onChange(date?.toISOString() ?? undefined)}
                                                        selected={!field.value ? null : moment(field.value).toDate()}
                                                        className={"form-control " + (errors.course?.endDate ? " input-invalid " : "")} locale={params.lang} dateFormat="yyyy-MM-dd" placeholderText={t("format.date")} />
                                                )}
                                            />
                                            <br />
                                            {errors.course?.endDate && <Form.Text className="text-invalid">{t(errors.course?.endDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="pt-2">
                            <Accordion.Header>{t("course.coachsSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <Controller
                                            name={`${formCoachsStateField}`}
                                            render={({ field }) => (
                                                <div>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_cource_info_coach_add_all_tooltip">{t("course.coach.addAll")}</Tooltip>}>
                                                        <Button className="btn btn-icon btn-sm mb-2" disabled={!isEditMode} onClick={() => field.onChange(availableCoachItems)}><i className="icon icon-light bi bi-chevron-double-right h7"></i></Button>
                                                    </OverlayTrigger>
                                                    <Select
                                                        {...field}
                                                        isMulti
                                                        options={availableCoachItems}
                                                        onChange={(selected) => field.onChange(selected)}
                                                        value={field.value}
                                                        hideSelectedOptions={true}
                                                        closeMenuOnSelect={false}
                                                        isDisabled={!isEditMode}
                                                        placeholder={t("course.coach.selected")}
                                                        noOptionsMessage={() => t("course.coach.selected")}
                                                        classNames={{
                                                            multiValueRemove: () => "select-multi-remove"
                                                        }}
                                                    />
                                                </div>
                                            )}

                                        />

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