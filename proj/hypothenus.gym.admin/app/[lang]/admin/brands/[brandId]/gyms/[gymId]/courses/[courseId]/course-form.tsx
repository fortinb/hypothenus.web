"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CourseInfo from "@/app/ui/components/course/course-info";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { clearCourseState, CourseState, updateCourseState } from "@/app/lib/store/slices/course-state-slice";
import { Coach } from "@/src/lib/entities/coach";
import { Course, CourseSchema, getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";
import { activateCourseAction, createCourseAction, deactivateCourseAction, deleteCourseAction, saveCourseAction } from "./actions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { localesConfigLanguageOrder } from "@/i18n/locales-client";

export interface CourseFormData {
    course: z.infer<typeof CourseSchema>;
    selectedCoachItems: CoachSelectedItem[];
}

export const CourseFormSchema = z.object({
    course: CourseSchema,
    selectedCoachItems: z.any().array().min(0)
});

export default function CourseForm({ lang, brandId, gymId, courseId, course, initialAvailableCoachItems, initialSelectedCoachItems }: {
    lang: string;
    brandId: string;
    gymId: string,
    courseId: string,
    course: Course,
    coachs: Coach[],
    initialAvailableCoachItems: CoachSelectedItem[],
    initialSelectedCoachItems: CoachSelectedItem[]
}) {
    const t = useTranslations("entity");
    const router = useRouter();

    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const dispatch = useAppDispatch();

    // Form State
    const [isCoachsItemsInitialized, setIsCoachsItemInitialized] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [availableCoachItems, setAvailableCoachItems] = useState<CoachSelectedItem[]>([]);
    const [originalSelectedCoachItems, setOriginalSelectedCoachItems] = useState<CoachSelectedItem[]>([]);
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

    const formContext = useForm<CourseFormData>({
        defaultValues: {
            course: mapEntityToForm(course),
            selectedCoachItems: initialSelectedCoachItems
        },
        mode: "all",
        resolver: zodResolver(CourseFormSchema)
    });

    const { fields } = useFieldArray({
        control: formContext.control,
        name: "selectedCoachItems"
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useEffect(() => {
        dispatch(updateCourseState(course));

        if (courseId === "new") {
            setIsEditMode(true);
        }

        // Initialize Coachs Items
        if (!isCoachsItemsInitialized) {
            setOriginalSelectedCoachItems(initialSelectedCoachItems);
            setAvailableCoachItems(initialAvailableCoachItems);

            setIsCoachsItemInitialized(true);
        }
    }, [dispatch, course, courseId, initialAvailableCoachItems, initialSelectedCoachItems, isCoachsItemsInitialized]);

    // Watch the entire form
    //const formData = formContext.watch();

    /* useEffect(() => {
         // Log the data to the console every time there is an error
         const hasErrors = Object.keys(formContext?.formState?.errors).length > 0
         if (hasErrors) {
             console.log("Current Form errors:", formContext.formState.errors);
         }
 
         // console.log("Current Form Data:", formData);
     }, [formData]); */

    const onSubmit: SubmitHandler<CourseFormData> = (formData: z.infer<typeof CourseFormSchema>) => {
        setIsEditMode(false);

        let course: Course = mapFormToEntity(formData, courseState.course);

        if (courseId == "new") {
            createCourse(course, formData.selectedCoachItems);
        } else {
            saveCourse(course, formData.selectedCoachItems);
        }
    }

    const createCourse = (course: Course, selectedCoachItems: CoachSelectedItem[]) => {
        createEntity(
            course,
            // Before save
            (_entity) => {
            },
            // Success
            (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("course.code", { type: "manual", message: t("course.validation.alreadyExists") });
                    setIsEditMode(true);
                } else {
                    setOriginalSelectedCoachItems(selectedCoachItems);

                    router.push(`/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${entity.id}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveCourse = (course: Course, selectedCoachItems: CoachSelectedItem[]) => {
        saveEntity(
            course.id, course, `/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${course.id}`,
            // Before save
            (_entity) => {
            },
            // Success
            async (entity) => {
                dispatch(updateCourseState(entity));
                setOriginalSelectedCoachItems(selectedCoachItems);

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
            course.id, course, `/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${course.id}`,
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
            course.id, course, `/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${course.id}`,
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
            course.id, course, `/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses/${course.id}`,
            () => {
                dispatch(clearCourseState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses`);
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

        formContext.reset({
            course: courseState.course,
            selectedCoachItems: originalSelectedCoachItems
        },);

        if (courseId == "new") {
            router.push(`/${lang}/admin/brands/${brandId}/gyms/${gymId}/courses`);
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
        if (courseState.course.id !== "") {

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
        if (courseState.course.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(course: Course): z.infer<typeof CourseSchema> {
        return {
            code: course.code,
            name: course.name.sort((a, b) => {
                const orderA = localesConfigLanguageOrder[a.language] ?? 999;  // Default to 999 if not in order
                const orderB = localesConfigLanguageOrder[b.language] ?? 999;
                return orderA - orderB;
            }),
            description: course.description.sort((a, b) => {
                const orderA = localesConfigLanguageOrder[a.language] ?? 999;
                const orderB = localesConfigLanguageOrder[b.language] ?? 999;
                return orderA - orderB;
            }),
            startDate: course.startDate,
            endDate: course.endDate,
            coachs: course.coachs?.map((coach) => {
                return coach;
            })
        }
    }

    function mapFormToEntity(formData: z.infer<typeof CourseFormSchema>, course: Course): Course {
        let updatedCourse: Course = {
            id: course.id,
            brandId: course.brandId,
            gymId: course.gymId,
            code: formData.course.code,
            name: formData.course.name,
            description: formData.course.description,
            startDate: formData.course.startDate,
            endDate: formData.course.endDate,
            coachs: formData.selectedCoachItems.map((item) => {
                return item.coach as Coach;
            }),
            isActive: course.isActive,
            messages: undefined,
            createdBy: course.createdBy,
            modifiedBy: course.modifiedBy
        };

        return updatedCourse;
    }

    return (
        <ErrorBoundary>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>

                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="course_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={courseState.course.id == "" ? true : courseState.course.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(courseState.course.id == null ? true : false)} isActivationDisabled={(courseState.course.id == null ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <CourseInfo lang={lang} course={courseState.course} formCoachsStateField="selectedCoachItems" availableCoachItems={availableCoachItems} isEditMode={isEditMode} isCancelling={isCancelling} />
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
        </ErrorBoundary>
    );
}

