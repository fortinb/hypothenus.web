"use client"

import i18n, { supportedLanguages, useTranslation } from "@/app/i18n/i18n";
import { Course } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import LocalizedStringInfo from "../localized/localized-string-info";
import DualListSelector, { DualListItem } from "../selection/dual-list-selector";
import { Coach } from "@/src/lib/entities/coach";
import { useEffect, useState } from "react";
import { formatName } from "@/src/lib/entities/person";

export default function CourseInfo({ course, availableCoachs, isEditMode, isCancelling }:
    {
        course: Course,
        availableCoachs: Coach[],
        isEditMode: boolean,
        isCancelling: boolean
    }) {
    const { register, formState: { errors } } = useFormContext<Course>();
    const { t } = useTranslation("entity");

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [availableCoachItems, setAvailableCoachItems] = useState<DualListItem[]>([]);

    useEffect(() => {
        if (isLoading) {
            // Initialize lists by filtering out selectedItems from sourceItems
            const initialAvailableItems: DualListItem[] = availableCoachs?.map((coach: Coach) => {
                return {
                    id: coach.id,
                    description: () => {
                        return formatName(coach.person);
                    },
                    source: coach,
                } as DualListItem;
            });

            setAvailableCoachItems(initialAvailableItems);
            setIsLoading(false);
        }
    }, [availableCoachs]);

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="course_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={4} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="course_info_input_code">{t("course.code")}</Form.Label>
                            <Form.Control type="input" id="course_info_input_code" placeholder={t("course.codePlaceholder")} {...register("code")}
                                className={errors.code ? "input-invalid" : ""} disabled={(course.id !== null ? true : false)} />
                            {errors.code && <Form.Text className="text-invalid">{t(errors.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <Accordion >
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={errors.name || errors.description ? "accordeon-header-invalid" : ""}>{t("course.description")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        {supportedLanguages.map((language: string, index: number) => {
                                            return (
                                                <div>
                                                    <Row className="m-2 gx-2">
                                                        <hr />
                                                        <Form.Label className="text-primary h5" >{t(`language.${language}`)}</Form.Label>
                                                    </Row>
                                                    <Row className="m-2 gx-2">
                                                        <Col xs={4} >
                                                            <Form.Group>
                                                                <Form.Label className="text-primary" htmlFor={`course_info_input_name_${index}`}>{t("course.name")}</Form.Label>
                                                                <LocalizedStringInfo key={index} index={index} id={`course_info_input_name_${index}`} nbRows={1} language={language as LanguageEnum} formStatefield={`name.${index}`} parent="name"></LocalizedStringInfo>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={8} >
                                                            <Form.Group>
                                                                <Form.Label className="text-primary" htmlFor={`course_info_input_description_${index}`}>{t("course.description")}</Form.Label>
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
                                            <Form.Label className="text-primary" htmlFor={`course_input_startDate`}>{t("course.startDate")}</Form.Label>
                                            <br />
                                            <Controller
                                                name={`startDate`}
                                                render={({ field }) => (
                                                    <DatePicker className={"form-control " + (errors.startDate ? " input-invalid " : "")} id={`course_input_startDate`} minDate={new Date()} selected={field.value} onChange={(date) => field.onChange(date)}
                                                        locale={i18n.resolvedLanguage} dateFormat="yyyy-MM-dd" placeholderText={t("format.date")} />
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
                                                    <DatePicker id={`course_input_endDate`} minDate={new Date()} onChange={(date) => field.onChange(date)}
                                                        selected={field.value}
                                                        className={"form-control " + (errors.endDate ? " input-invalid " : "")} locale={i18n.resolvedLanguage} dateFormat="yyyy-MM-dd" placeholderText={t("format.date")} />
                                                )}
                                            />
                                            <br />
                                            {errors.endDate && <Form.Text className="text-invalid">{t(errors.endDate.message as string)}</Form.Text>}
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
                                        <DualListSelector formStatefield="selectedCoachs" sourceLabel={t("course.coach.available")} selectedLabel={t("course.coach.selected")} sourceItems={availableCoachItems} ></DualListSelector>
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