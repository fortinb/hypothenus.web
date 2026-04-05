"use client"

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import LocalizedStringInfo from "../localized/localized-string-info";
import { useTranslations } from "next-intl";
import "@/app/lib/i18n/datepicker-locales";
import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { localesConfig } from "@/i18n/locales-client";
import { MembershipPlanFormData } from "@/app/[lang]/admin/brands/[brandId]/membership-plans/[membershipPlanId]/membership-plan-form";
import FormLabelRequired from "../forms/form-label-required";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { CourseSelectedItem } from "@/src/lib/entities/ui/course-selected-item";
import { MembershipPlanPeriodEnum } from "@/src/lib/entities/enum/membership-plan-period-enum";
import { BillingFrequencyEnum } from "@/src/lib/entities/enum/billing-frequency-enum";
import { Currency } from "@/src/lib/entities/pricing/currency";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import DatePicker from "react-datepicker";
import moment from "moment";

export default function MembershipPlanInfo({ lang, currency, availableGymItems, formGymsStateField, availableCourseItems, formCoursesStateField, isEditMode, isCancelling }:
    {
        lang: string,
        currency: Currency,
        availableGymItems: GymSelectedItem[],
        formGymsStateField: string,
        availableCourseItems: CourseSelectedItem[],
        formCoursesStateField: string,
        isEditMode: boolean,
        isCancelling: boolean
    }) {
    const { register, formState: { errors }, getValues } = useFormContext<MembershipPlanFormData>();
    const t = useTranslations("entity");

    const [accordeonDefaultActiveKeys] = useState<string[]>(["0", "1", "2", "3", "4"]);

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="membership_plan_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="gx-2">
                    <Accordion defaultActiveKey={accordeonDefaultActiveKeys} alwaysOpen>
                        <Accordion.Item eventKey="0" className="pt-2">
                            <Accordion.Header className={errors.membershipPlan?.title ? "accordeon-header-invalid" : ""}>{t("membershipPlan.namesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="gx-2">
                                    <Col xs={12} className="p-1" >
                                        {localesConfig.locales.map((language: string, index: number) => {
                                            return (
                                                <div key={language}>
                                                    <Row className="m-2 gx-2">
                                                        <Col xs={2} >
                                                            <Form.Label className="text-primary" >{t(`language.${language}`)}</Form.Label>
                                                        </Col>
                                                        <Col xs={4} >
                                                            <Form.Group>
                                                                <FormLabelRequired className="text-primary" required={true} htmlFor={`membership_plan_info_input_name_${index}`} label={t("membershipPlan.name")}></FormLabelRequired>
                                                                <LocalizedStringInfo key={index} index={index} id={`membership_plan_info_input_name_${index}`} nbRows={1} language={language as LanguageEnum} formStatefield={`membershipPlan.name.${index}`} parent="membershipPlan.name"></LocalizedStringInfo>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={6} >
                                                            <Form.Group>
                                                                <FormLabelRequired className="text-primary" required={true} htmlFor={`membership_plan_info_input_description_${index}`} label={t("membershipPlan.description")}></FormLabelRequired>
                                                                <LocalizedStringInfo key={index} index={index} id={`membership_plan_info_input_description_${index}`} nbRows={2} language={language as LanguageEnum} formStatefield={`membershipPlan.description.${index}`} parent="membershipPlan.description"></LocalizedStringInfo>
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
                            <Accordion.Header className={errors.membershipPlan?.title ? "accordeon-header-invalid" : ""}>{t("membershipPlan.planSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 gx-2">
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <FormLabelRequired className="text-primary" htmlFor={`membership-plan-period-dropdown`} label={t("membershipPlan.period.label")}></FormLabelRequired>

                                            <Form.Select id="membership-plan-period-dropdown" defaultValue={MembershipPlanPeriodEnum.classes} {...register(`membershipPlan.period`)}>
                                                {Object.values(MembershipPlanPeriodEnum).map((period) => (
                                                    <option key={period} value={period}>{t(`membershipPlan.period.${period}`)}</option>
                                                ))}
                                            </Form.Select>
                                            {errors?.membershipPlan?.period && <Form.Text className="text-invalid">{t(errors.membershipPlan.period.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="membership-plan-period-tooltip">{t("membershipPlan.period.tooltip")}</Tooltip>}>
                                                <FormLabelRequired className="text-primary" htmlFor="membership_plan_info_input_number_of_classes" required={true} label={t("membershipPlan.numberOfClasses")}></FormLabelRequired>
                                            </OverlayTrigger>
                                            <Form.Control type="input" id="membership_plan_info_input_number_of_classes" {...register("membershipPlan.numberOfClasses")}
                                                className={errors.membershipPlan?.numberOfClasses ? "input-invalid" : ""} />
                                            {errors.membershipPlan?.numberOfClasses && <Form.Text className="text-invalid">{t(errors.membershipPlan?.numberOfClasses.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                    </Col>
                                </Row>
                                <Row className="m-2 gx-2">
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <FormLabelRequired className="text-primary" htmlFor={`membership-plan-billing-frequency-dropdown`} label={t("membershipPlan.billingFrequency.label")}></FormLabelRequired>
                                            <Form.Select id="membership-plan-billing-frequency-dropdown" defaultValue={BillingFrequencyEnum.oneTime} {...register(`membershipPlan.billingFrequency`)}>
                                                {Object.values(BillingFrequencyEnum).map((frequency) => (
                                                    <option key={frequency} value={frequency}>{t(`membershipPlan.billingFrequency.${frequency}`)}</option>
                                                ))}
                                            </Form.Select>
                                            {errors?.membershipPlan?.billingFrequency && <Form.Text className="text-invalid">{t(errors.membershipPlan.billingFrequency.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <FormLabelRequired className="text-primary" htmlFor="membership_plan_info_input_cost_amount" required={true} label={t("membershipPlan.cost.amount")}></FormLabelRequired>
                                            <div className="d-flex flex-row align-items-center">
                                                <div>
                                                    <Controller
                                                        name={`membershipPlan.cost.amount`}
                                                        render={({ field }) => (
                                                            <IMaskInput
                                                                {...field}
                                                                value={field.value != null ? String(field.value) : ""}
                                                                mask={Number}
                                                                scale={2}              // 2 decimal digits
                                                                thousandsSeparator=""  // or "," for grouping
                                                                radix="."              // decimal separator
                                                                mapToRadix={[","]}     // accept comma as decimal too
                                                                normalizeZeros={true}
                                                                padFractionalZeros={true}  // always show .00
                                                                onAccept={(value) => field.onChange(value)}
                                                                inputRef={field.ref}
                                                                id={"membership_plan_info_input_cost_amount"}
                                                                placeholder="0.00"
                                                                className={"form-control" + (errors.membershipPlan?.cost?.amount ? " input-invalid" : "")}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="ms-1">
                                                    {currency.symbol} ({currency.code})
                                                </div>
                                            </div>
                                            {errors.membershipPlan?.cost?.amount && <Form.Text className="text-invalid">{t(errors.membershipPlan?.cost?.amount.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="membership-plan-duration_in_months-tooltip">{t("membershipPlan.durationInMonths.tooltip")}</Tooltip>}>
                                                <FormLabelRequired className="text-primary" htmlFor="membership_plan_info_input_duration_in_months" required={true} label={t("membershipPlan.durationInMonths.label")}></FormLabelRequired>
                                            </OverlayTrigger>
                                            <Form.Control type="input" id="membership_plan_info_input_duration_in_months" {...register("membershipPlan.durationInMonths")}
                                                className={errors.membershipPlan?.durationInMonths ? "input-invalid" : ""} />
                                            {errors.membershipPlan?.durationInMonths && <Form.Text className="text-invalid">{t(errors.membershipPlan?.durationInMonths.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="m-2 gx-2">
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <div className="d-flex flex-row  justify-content-start m-2 gx-2">
                                                <div className="form-check form-switch pe-2">
                                                    <Controller
                                                        name="membershipPlan.guestPrivilege"
                                                        render={({ field }) => (
                                                            <Form.Control aria-label={t("membershipPlan.guestPrivilege")} className="form-check-input form-check-input-lg" type="checkbox" role="switch"
                                                                id="membershipPlan-guestPrivilege-checkbox"
                                                                checked={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                ref={field.ref} />
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Label className="text-primary ps-2" htmlFor="membershipPlan-guestPrivilege-checkbox">
                                                        {t("membershipPlan.guestPrivilege")}</Form.Label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <div className="d-flex flex-row  justify-content-start m-2 gx-2">
                                                <div className="form-check form-switch pe-2">
                                                    <Controller
                                                        name="membershipPlan.promotional"
                                                        render={({ field }) => (
                                                            <Form.Control aria-label={t("membershipPlan.promotional")} className="form-check-input form-check-input-lg" type="checkbox" role="switch"
                                                                id="membershipPlan-promotional-checkbox"
                                                                checked={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                ref={field.ref} />
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Label className="text-primary ps-2" htmlFor="membershipPlan-promotional-checkbox">
                                                        {t("membershipPlan.promotional")}</Form.Label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4} className="p-1" >
                                        <Form.Group>
                                            <div className="d-flex flex-row  justify-content-start m-2 gx-2">
                                                <div className="form-check form-switch pe-2">
                                                    <Controller
                                                        name="membershipPlan.giftCard"
                                                        render={({ field }) => (
                                                            <Form.Control aria-label={t("membershipPlan.giftCard")} className="form-check-input form-check-input-lg" type="checkbox" role="switch"
                                                                id="membershipPlan-giftCard-checkbox"
                                                                checked={field.value}
                                                                onChange={(value) => field.onChange(value)}
                                                                ref={field.ref} />
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Label className="text-primary ps-2" htmlFor="membershipPlan-giftCard-checkbox">
                                                        {t("membershipPlan.giftCard")}</Form.Label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="pt-2">
                            <Accordion.Header className={(errors.membershipPlan?.startDate || errors.membershipPlan?.endDate ? "accordeon-header-invalid" : "")}>{t("membershipPlan.datesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <FormLabelRequired className="text-primary" required={true} htmlFor={`membershipPlan_input_startDate`} label={t("membershipPlan.startDate")}></FormLabelRequired>
                                            <br />
                                            <Controller
                                                name={`membershipPlan.startDate`}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        className={"form-control " + (errors.membershipPlan?.startDate ? " input-invalid " : "")}
                                                        id={`membershipPlan_input_startDate`}
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
                                            {errors.membershipPlan?.startDate && <Form.Text className="text-invalid">{t(errors.membershipPlan.startDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} className="p-1" >
                                        <Form.Group>
                                            <Form.Label className="text-primary" htmlFor={`membershipPlan_input_endDate`}>{t("membershipPlan.endDate")}</Form.Label>
                                            <br />
                                            <Controller
                                                name={"membershipPlan.endDate"}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        id={`membershipPlan_input_endDate`}
                                                        minDate={new Date()}
                                                        onChange={(date: Date | null) => field.onChange(date ? date.toISOString() : null)}
                                                        selected={!field.value ? null : moment(field.value).toDate()}
                                                        className={"form-control " + (errors.membershipPlan?.endDate ? " input-invalid " : "")}
                                                        locale={lang}
                                                        dateFormat="yyyy-MM-dd"
                                                        placeholderText={t("format.date")} />
                                                )}
                                            />
                                            <br />
                                            {errors.membershipPlan?.endDate && <Form.Text className="text-invalid">{t(errors.membershipPlan.endDate.message as string)}</Form.Text>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="pt-2">
                            <Accordion.Header className={errors.membershipPlan?.title ? "accordeon-header-invalid" : ""}>{t("membershipPlan.titlesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="p-2">
                                    <Col xs={12} className="p-1" >
                                        {localesConfig.locales.map((language: string, index: number) => {
                                            return (
                                                <div key={language}>
                                                    <Row className="m-2 gx-2">
                                                        <Col xs={2} >
                                                            <Form.Label className="text-primary" >{t(`language.${language}`)}</Form.Label>
                                                        </Col>
                                                        <Col xs={10} >
                                                            <Form.Group>
                                                                <FormLabelRequired className="text-primary" required={true} htmlFor={`membership_plan_info_input_title_${index}`} label={t("membershipPlan.title")}></FormLabelRequired>
                                                                <LocalizedStringInfo key={index} index={index} id={`membership_plan_info_input_title_${index}`} nbRows={1} language={language as LanguageEnum} formStatefield={`membershipPlan.title.${index}`} parent="membershipPlan.title"></LocalizedStringInfo>
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
                        <Accordion.Item eventKey="3" className="pt-2">
                            <Accordion.Header>{t("membershipPlan.gymsSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <Controller
                                            name={`${formGymsStateField}`}
                                            render={({ field }) => (
                                                <div>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_membership_plan_info_gyms_add_all_tooltip">{t("membershipPlan.gyms.addAll")}</Tooltip>}>
                                                        <Button className="btn btn-icon btn-sm mb-2" disabled={!isEditMode} onClick={() => field.onChange(availableGymItems)}><i className="icon icon-light bi bi-chevron-double-right h7"></i></Button>
                                                    </OverlayTrigger>
                                                    <Select
                                                        {...field}
                                                        isMulti={true}
                                                        options={availableGymItems}
                                                        onChange={(selected) => field.onChange(selected)}
                                                        value={field.value}
                                                        hideSelectedOptions={true}
                                                        closeMenuOnSelect={false}
                                                        isDisabled={!isEditMode}
                                                        placeholder={t("membershipPlan.gyms.selected")}
                                                        noOptionsMessage={() => t("membershipPlan.gyms.selected")}
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
                        <Accordion.Item eventKey="4" className="pt-2">
                            <Accordion.Header>{t("membershipPlan.coursesSection")}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Row className="m-2 p-2">
                                    <Col xs={12} className="p-1" >
                                        <Controller
                                            name={`${formCoursesStateField}`}
                                            render={({ field }) => (
                                                <div>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_membership_plan_info_course_add_all_tooltip">{t("membershipPlan.courses.addAll")}</Tooltip>}>
                                                        <Button className="btn btn-icon btn-sm mb-2" disabled={!isEditMode} onClick={() => field.onChange(availableCourseItems)}><i className="icon icon-light bi bi-chevron-double-right h7"></i></Button>
                                                    </OverlayTrigger>
                                                    <Select
                                                        {...field}
                                                        isMulti={true}
                                                        options={availableCourseItems}
                                                        onChange={(selected) => field.onChange(selected)}
                                                        value={field.value}
                                                        hideSelectedOptions={true}
                                                        closeMenuOnSelect={false}
                                                        isDisabled={!isEditMode}
                                                        placeholder={t("membershipPlan.courses.selected")}
                                                        noOptionsMessage={() => t("membershipPlan.courses.selected")}
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

/*checked={} */ 