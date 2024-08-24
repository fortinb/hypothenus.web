"use client"

import { supportedLanguages, useTranslation } from "@/app/i18n/i18n";
import { Course } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import LocalizedStringInfo from "../localized/localized-string-info";

export default function CourseInfo({ course, isEditMode, isCancelling }:
    {
        course: Course,
        isEditMode: boolean,
        isCancelling: boolean
    }) {
    const { register, formState: { errors } } = useFormContext();
    const { t } = useTranslation("entity");

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="course_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <Col xs={4} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="course_info_input_code">{t("course.code")}</Form.Label>
                            <Form.Control type="input" id="course_info_input_code" placeholder={t("course.codePlaceholder")} {...register("code")}
                                className={errors.code ? "input-invalid" : ""}
                                disabled={(course.id !== null ? true : false)} />
                            {errors.code && <Form.Text className="text-invalid">{t(errors.code.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
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
            </Container>
        </fieldset>
    );
}