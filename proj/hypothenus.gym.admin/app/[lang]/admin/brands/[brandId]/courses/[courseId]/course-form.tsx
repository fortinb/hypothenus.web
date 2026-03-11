"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CourseInfo from "@/app/ui/components/course/course-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { clearCourseState, CourseState, updateCourseState } from "@/app/lib/store/slices/course-state-slice";
import { Course, CourseSchema, getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";

import { activateCourseAction, createCourseAction, deactivateCourseAction, deleteCourseAction, saveCourseAction } from "./actions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { localesConfigLanguageOrder } from "@/i18n/locales-client";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { Authorize } from "@/app/ui/components/security/authorize";
import moment from "moment";

export interface CourseFormData {
    course: z.infer<typeof CourseSchema>;
}

export default function CourseForm({ lang, course }: {
    lang: string;
    course: Course,
}) {
    const t = useTranslations("entity");
    const router = useRouter();

    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form State
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Course>({
        actions: {
            create: createCourseAction,
            save: saveCourseAction,
            activate: activateCourseAction,
            deactivate: deactivateCourseAction,
            delete: deleteCourseAction
        }
    });

    const formContext = useForm<z.infer<typeof CourseSchema>>({
        defaultValues: mapEntityToForm(course),
        resolver: zodResolver(CourseSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useEffect(() => {
        dispatch(updateCourseState(course));

        if (course.uuid === null) {
            setIsEditMode(true);
        }
    }, [dispatch, course]);

    // Watch the entire form and log errors when present (debug only)
    useFormDebug(formContext);

    const onSubmit: SubmitHandler<z.infer<typeof CourseSchema>> = (formData: z.infer<typeof CourseSchema>) => {
        setIsEditMode(false);

        let course: Course = mapFormToEntity(formData, courseState.course);

        if (course.uuid === null) {
            createCourse(course);
        } else {
            saveCourse(course);
        }
    }

    const createCourse = (course: Course) => {
        course.brandUuid = brandState.brand.uuid;

        createEntity(
            course,
            // Before save
            (_entity) => {
            },
            // Success
            (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("code", { type: "manual", message: t("course.validation.alreadyExists") });
                    showResultToast(false, t("action.saveError"), undefined);
                    setIsEditMode(true);
                } else {
                    router.push(`/${lang}/admin/brands/${entity.brandUuid}/courses/${entity.uuid}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveCourse = (course: Course) => {
        saveEntity(
            course, `/${lang}/admin/brands/${course.brandUuid}/courses/${course.uuid}`,
            // Before save
            (_entity) => {
            },
            // Success
            async (entity) => {
                dispatch(updateCourseState(entity));

                showResultToast(true, t("action.saveSuccess"));
                setIsEditMode(true);
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const activateCourse = (course: Course) => {
        activateEntity(
            course, `/${lang}/admin/brands/${course.brandUuid}/courses/${course.uuid}`,
            (entity) => {
                dispatch(updateCourseState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateCourse = (course: Course) => {
        deactivateEntity(
            course, `/${lang}/admin/brands/${course.brandUuid}/courses/${course.uuid}`,
            (entity) => {
                dispatch(updateCourseState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteCourse = (course: Course) => {
        deleteEntity(
            course, `/${lang}/admin/brands/${course.brandUuid}/courses/${course.uuid}`,
            () => {
                dispatch(clearCourseState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${course.brandUuid}/courses`);
                }, 1000);
            },
            (result) => {
                showResultToast(false, t("action.deleteError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);

        formContext.reset(mapEntityToForm(courseState.course));

        if (courseState.course.uuid === null) {
            router.push(`/${lang}/admin/brands/${courseState.course.brandUuid}/courses`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateCourse(courseState.course);
        } else {
            deactivateCourse(courseState.course);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (courseState.course.uuid !== null) {

            if (isEditMode === true) {
                onCancel();
            } else {
                setIsEditMode(true);
                setIsCancelling(false);
            }
        }
    }

    function onDelete(confirmation: boolean) {
        if (confirmation) {
            deleteCourse(courseState.course);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (courseState.course.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(course: Course): z.infer<typeof CourseSchema> {
        return {
            code: course.code,
            name: [...course.name].sort((a, b) => {
                const orderA = localesConfigLanguageOrder[a.language] ?? 999;
                const orderB = localesConfigLanguageOrder[b.language] ?? 999;
                return orderA - orderB;
            }),
            description: [...course.description].sort((a, b) => {
                const orderA = localesConfigLanguageOrder[a.language] ?? 999;
                const orderB = localesConfigLanguageOrder[b.language] ?? 999;
                return orderA - orderB;
            }),
            startDate: course.startDate ? moment(course.startDate).format("YYYY-MM-DD") : null,
            endDate: course.endDate ? moment(course.endDate).format("YYYY-MM-DD") : null,
        }
    }

    function mapFormToEntity(formData: z.infer<typeof CourseSchema>, course: Course): Course {
        return {
            ...course,
            code: formData.code,
            name: formData.name,
            description: formData.description,
            startDate: moment(formData.startDate).format("YYYY-MM-DD"),
            endDate: formData.endDate ? moment(formData.endDate).format("YYYY-MM-DD") : null,
        };
    }

    return (
        <>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>

                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="course_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <Authorize roles="manager">
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={courseState.course.uuid == null ? true : courseState.course.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(courseState.course.uuid == null ? true : false)} isActivationDisabled={(courseState.course.uuid == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                </Authorize>
                                <CourseInfo lang={lang} course={courseState.course} isEditMode={isEditMode} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="course_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("course.deleteConfirmation.title", { name: getCourseName(courseState.course, lang as LanguageEnum) })} text={t("course.deleteConfirmation.text")}
                                yesText={t("course.deleteConfirmation.yes")} noText={t("course.deleteConfirmation.no")}
                                actionText={t("course.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>
            </div>
        </>
    );
}

