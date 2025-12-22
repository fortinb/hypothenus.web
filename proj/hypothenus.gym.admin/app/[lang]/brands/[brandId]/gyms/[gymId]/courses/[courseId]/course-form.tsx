"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CourseInfo, { SelectItem } from "@/app/ui/components/course/course-info";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import ToastSuccess from "@/app/ui/components/notifications/toast-success";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { CourseState, updateCourseState } from "@/app/lib/store/slices/course-state-slice";
import { Coach } from "@/src/lib/entities/coach";
import { Course, CourseSchema, getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { formatPersonName } from "@/src/lib/entities/person";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { delCourse, postActivateCourse, postCourse, putCourse, postDeactivateCourse } from "@/app/lib/data/courses-data-service-client";


export interface CourseFormData {
    course: Course;
    selectedCoachItems: SelectItem[];
}

export const CourseFormSchema = z.object({
    course: CourseSchema,
    selectedCoachItems: z.any().array().min(0)
});

export default function CourseForm({ lang, brandId, gymId, courseId, course, coachs}: { lang: string; brandId: string; gymId: string, courseId: string, course: Course, coachs: Coach[] }) {
    const t = useTranslations("entity");
    const router = useRouter();
    const pathname = usePathname();

    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const dispatch = useAppDispatch();

    const [isCoachsItemsInitialized, setIsCoachsItemInitialized] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [availableCoachs, setAvailableCoachs] = useState<Coach[]>([]);
    const [availableCoachItems, setAvailableCoachItems] = useState<SelectItem[]>([]);
    const [initialSelectedCoachItems, setInitialSelectedCoachItems] = useState<SelectItem[]>([]);

    const formContext = useForm<CourseFormData>({
        defaultValues: {
            course: course,
            selectedCoachItems: initialSelectedCoachItems
        },
        mode: "all",
        resolver: zodResolver(CourseFormSchema)
    });

    const { fields } = useFieldArray({
        control: formContext.control,
        name: "selectedCoachItems"
    });

    const toggleSuccess = () => setSuccess(false);

    useEffect(() => {
        dispatch(updateCourseState(course));

        if (courseId === "new") {
            setIsEditMode(true);
        }

        // Initialize Coachs Items
        if (!isCoachsItemsInitialized) {
            setAvailableCoachs(coachs);
            const availableItems: SelectItem[] = availableCoachs?.map((coach: Coach) => {
                return {
                    coach: coach,
                    label: formatPersonName(coach.person),
                    value: coach.id,
                } as SelectItem;
            });

            const initialAvailableCoachItems = availableItems
                .filter((item) => !courseState.course.coachs?.some((selected) => selected.id === item.coach))
                .sort((a, b) => a.label.localeCompare(b.label));

            setAvailableCoachItems(initialAvailableCoachItems);

            setIsCoachsItemInitialized(true);
        }

      //  initBreadcrumb(getCourseName(courseState.course, lang as LanguageEnum));
    }, [dispatch, course]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            reset: false,
            id: "course.[courseId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    function initSelectedCoachItems(): SelectItem[] {
        const initialSelectedCoachItems: SelectItem[] = courseState.course.coachs?.map((coach: Coach) => {
            return {
                coach: coach,
                label: formatPersonName(coach.person),
                value: coach.id,
            } as SelectItem;
        });


        return initialSelectedCoachItems;
    }

    const onSubmit: SubmitHandler<CourseFormData> = (formData: z.infer<typeof CourseFormSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (courseState.course.id == null) {
            createCourse(formData);
        } else {
            saveCourse(formData);
        }
    }

    const createCourse = async (formData: z.infer<typeof CourseFormSchema>) => {
        let newCourse: Course = mapForm(formData, courseState.course);
        let course: Course = await postCourse(brandId, gymId, newCourse);

        const duplicate = course.messages?.find(m => m.code == DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST)
        if (duplicate) {
            formContext.setError("course.code", { type: "manual", message: t("course.validation.alreadyExists") });
            setIsEditMode(true);
        } else {
            setSuccess(true);
            setTextSuccess(t("action.saveSuccess"));
            dispatch(updateCourseState(course));
            setInitialSelectedCoachItems(formData.selectedCoachItems as SelectItem[]);

            await afterSaveCourse(course);

            router.push(`/${lang}/brands/${course.brandId}/gyms/${course.gymId}/courses/${course.id}`);
        }
    }

    const saveCourse = async (formData: z.infer<typeof CourseFormSchema>) => {
        let updatedCourse: Course = mapForm(formData, courseState.course);

        let course: Course = await putCourse(brandId, gymId, courseId, updatedCourse);

        dispatch(updateCourseState(course));
        setInitialSelectedCoachItems(formData.selectedCoachItems as SelectItem[]);

        await afterSaveCourse(updatedCourse);
    }

    const afterSaveCourse = async (course: Course) => {
        setTextSuccess(t("action.saveSuccess"));
        setSuccess(true);
        setIsSaving(false);
        setIsEditMode(true);
    }

    const activateCourse = async (gymId: string, courseId: string) => {
        let course: Course = await postActivateCourse(brandId, gymId, courseId);

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateCourse = async (gymId: string, courseId: string) => {
        let course: Course = await postDeactivateCourse(brandId, gymId, courseId);

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteCourse = async (gymId: string, courseId: string) => {
        await delCourse(brandId, gymId, courseId);

        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/${lang}/brands/${brandId}/gyms/${gymId}/courses`);
        }, 2000);
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);

        // Reset selected coahch items to initial state
        initSelectedCoachItems();

        formContext.reset({
            course: courseState.course,
            selectedCoachItems: initialSelectedCoachItems
        },);

        if (courseId == "new") {
            router.push(`/${lang}/brands/${brandId}/gyms/${gymId}/courses`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        setIsActivating(true);
        if (e.currentTarget.checked) {
            activateCourse(courseState.course.gymId, courseState.course.id);
        } else {
            deactivateCourse(courseState.course.gymId, courseState.course.id);
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
            setIsDeleting(true);
            deleteCourse(courseState.course.gymId, courseState.course.id);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (courseState.course.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapForm(formData: z.infer<typeof CourseFormSchema>, course: Course): Course {
        let updatedCourse: Course = {
            id: formData.course.id,
            brandId: formData.course.brandId,
            gymId: formData.course.gymId,
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
            createdBy: undefined,
            modifiedBy: undefined,
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
                                <CourseInfo course={courseState.course} formCoachsStateField="selectedCoachItems" availableCoachItems={availableCoachItems} isEditMode={isEditMode} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="course_info_form" />
                            </Form>

                            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
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

