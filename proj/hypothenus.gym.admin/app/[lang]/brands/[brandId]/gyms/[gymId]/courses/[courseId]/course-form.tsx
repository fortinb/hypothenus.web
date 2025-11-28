"use client"

import FormActionBar from "@/app/[lang]/components/actions/form-action-bar";
import FormActionButtons from "@/app/[lang]/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/[lang]/components/actions/modal-confirmation";
import CourseInfo from "@/app/[lang]/components/course/course-info";
import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import Loader from "@/app/[lang]/components/navigation/loader";
import ToastSuccess from "@/app/[lang]/components/notifications/toast-success";
import { DualListItem } from "@/app/[lang]/components/selection/dual-list-selector";
import i18n, { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
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

export interface CourseFormData {
    course: Course;
    selectedCoachItems: DualListItem[];
}

export const CourseFormSchema = z.object({
    course: CourseSchema,
    selectedCoachItems: z.any().array().min(0)
});

export default function CourseForm({ brandId, gymId, courseId }: { brandId: string; gymId: string, courseId: string }) {
    const { t } = useTranslation("entity");
    const router = useRouter();
    const pathname = usePathname();

    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCoachsLoaded, setIsCoachsLoaded] = useState<boolean>(false);
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
    const [availableCoachItems, setAvailableCoachItems] = useState<DualListItem[]>([]);
    const [originalSelectedCoachItems, setOriginalSelectedCoachItems] = useState<DualListItem[]>([]);
    //const { control, handleSubmit } = useForm<FormInputs>()
    const formContext = useForm<CourseFormData>({
        defaultValues: {
            course: courseState.course,
            selectedCoachItems: originalSelectedCoachItems
        },
        mode: "all",
        resolver: zodResolver(CourseFormSchema)
    });

    const { fields, append, remove } = useFieldArray({
        control: formContext.control,
        name: "selectedCoachItems"
    });

    const toggleSuccess = () => setSuccess(false);

    useEffect(() => {
        if (isLoading) {

            if (courseId !== "new") {
                fetchCourse(gymId, courseId);
            }

            if (courseId == "new") {
                setIsEditMode(true);
                formContext.setValue("course.brandId", brandId);
                formContext.setValue("course.gymId", gymId);
                setIsLoading(false);
            }

            if (!isCoachsLoaded) {
                fetchCoachs(brandId, gymId);
            }
        }

        // Initialize DualList Coachs Items
        if (!isLoading && isCoachsLoaded && !isCoachsItemsInitialized) {
            const availableItems: DualListItem[] = availableCoachs?.map((coach: Coach) => {
                return {
                    id: coach.id,
                    description: () => {
                        return formatPersonName(coach.person);
                    },
                    source: coach,
                } as DualListItem;
            });

            const initialAvailableCoachItems = availableItems
                .filter((item) => !courseState.course.coachs?.some((selected) => selected.id === item.id))
                .sort((a, b) => a.description().localeCompare(b.description()));

            setAvailableCoachItems(initialAvailableCoachItems);

            initSelectedCoachItems();

            setIsCoachsItemInitialized(true);
        }

        if (!isLoading && isCoachsItemsInitialized && courseId !== "new") {
            formContext.reset({
                course: courseState.course,
                selectedCoachItems: originalSelectedCoachItems
            },);
            initBreadcrumb(getCourseName(courseState.course, i18n.resolvedLanguage as LanguageEnum))
        }

    }, [courseState, availableCoachs, isCoachsItemsInitialized]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            id: "course.[courseId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const onCoachItemAdded = (item?: DualListItem, addAll: boolean = false) => {

        if (!addAll) {
            if (!item) return;
            append(item);
            const updatedAvailableItems = availableCoachItems.filter((i) => i.id !== item.id);
            setAvailableCoachItems(updatedAvailableItems);
        }

        if (addAll) {
            availableCoachItems.forEach(item => append(item));
            setAvailableCoachItems([]);
        }
    };

    const onCoachItemRemoved = (index: number, removeAll: boolean = false) => {

        if (!removeAll) {
            if (index < 0) return;

            const item = formContext.getValues(`selectedCoachItems.${index}`);
            if (!item) return;

            // Remove from RHF field array
            remove(index);

            const updatedAvailableItems = [...availableCoachItems, item].sort((a, b) => a.description().localeCompare(b.description()));
            setAvailableCoachItems(updatedAvailableItems);
        }

        if (removeAll) {
            const removedItems = formContext.getValues("selectedCoachItems");
            if (removedItems.length > 0) {
                const updatedAvailableItems = [...availableCoachItems, ...removedItems].sort((a, b) => a.description().localeCompare(b.description()));
                setAvailableCoachItems(updatedAvailableItems);
            }

            remove();
        }
    };

    function initSelectedCoachItems() {
        const initialSelectedCoachItems: DualListItem[] = courseState.course.coachs?.map((coach: Coach) => {
            return {
                id: coach.id,
                description: () => {
                    return formatPersonName(coach.person);
                },
                source: coach,
            } as DualListItem;
        });

        setOriginalSelectedCoachItems(initialSelectedCoachItems);
    }

    const fetchCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.get(`/api/brands/${brandId}/gyms/${gymId}/courses/${courseId}`);
        let course: Course = response.data;

        dispatch(updateCourseState(course));
        setIsLoading(false);
    }

    const fetchCoachs = async (brandId: string, gymId: string) => {
        let response = await axiosInstance.get(`/api/brands/${brandId}/gyms/${gymId}/coachs?page=0&pageSize=1000&includeInactive=false`);
        let coachs: Coach[] = response.data.content;

        setAvailableCoachs(coachs);
        setIsCoachsLoaded(true);
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
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${formData.course.gymId}/courses`, formData.course);
        let course: Course = response.data;

        const duplicate = course.messages?.find(m => m.code == DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST)
        if (duplicate) {
            formContext.setError("course.code", { type: "manual", message: t("course.validation.alreadyExists") });
            setIsEditMode(true);
        } else {
            setSuccess(true);
            setTextSuccess(t("action.saveSuccess"));
            dispatch(updateCourseState(course));
            setOriginalSelectedCoachItems(formData.selectedCoachItems as DualListItem[]);

            await postSaveCourse(course);

            router.push(`/${i18n.resolvedLanguage}/brands/${course.brandId}/gyms/${course.gymId}/courses/${course.id}`);
        }
    }

    const saveCourse = async (formData: z.infer<typeof CourseFormSchema>) => {
        let updatedCourse: Course = mapForm(formData, courseState.course);

        let response = await axiosInstance.put(`/api/brands/${brandId}/gyms/${formData.course.gymId}/courses/${updatedCourse.id}`, updatedCourse);
        let course: Course = response.data as Course;

        dispatch(updateCourseState(course));
        setOriginalSelectedCoachItems(formData.selectedCoachItems as DualListItem[]);

        await postSaveCourse(updatedCourse);
    }

    const postSaveCourse = async (course: Course) => {
        setTextSuccess(t("action.saveSuccess"));
        setSuccess(true);
        setIsSaving(false);
    }

    const activateCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/courses/${courseId}/activate`);
        let course: Course = response.data;

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/courses/${courseId}/deactivate`);
        let course: Course = response.data;

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteCourse = async (gymId: string, courseId: string) => {
        await axiosInstance.delete(`/api/brands/${brandId}/gyms/${gymId}/courses/${courseId}`);

        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/${i18n.resolvedLanguage}/brands/${brandId}/gyms/${gymId}/courses`);
        }, 2000);
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);

        // Reset selected coahch items to initial state
        initSelectedCoachItems();

        formContext.reset({
            course: courseState.course,
            selectedCoachItems: originalSelectedCoachItems
        },);

        if (courseId == "new") {
            router.push(`/${i18n.resolvedLanguage}/brands/${brandId}/gyms/${gymId}/courses`);
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
            id: course.id,
            brandId: course.brandId,
            gymId: course.gymId,
            code: formData.course.code,
            name: formData.course.name,
            description: formData.course.description,
            startDate: formData.course.startDate,
            endDate: formData.course.endDate,
            coachs: formData.selectedCoachItems.map((item) => {
                return item.source as Coach;
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

                {isLoading &&
                    <div className="flex-fill w-100 h-100">
                        <Loader />
                    </div>
                }

                {!isLoading && isCoachsItemsInitialized &&
                    <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                        <div className="w-100 h-100">
                            <FormProvider {...formContext} >
                                <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="course_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={courseState.course.id == "" ? true : courseState.course.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(courseState.course.id == null ? true : false)} isActivationDisabled={(courseState.course.id == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                    <CourseInfo course={courseState.course} formCoachsStateField="selectedCoachItems" availableCoachItems={availableCoachItems} onCoachItemAdded={onCoachItemAdded} onCoachItemRemoved={onCoachItemRemoved} isEditMode={isEditMode} isCancelling={isCancelling} />
                                    <hr className="mt-1 mb-1" />
                                    <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="course_info_form" />
                                </Form>

                                <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                                <ModalConfirmation title={t("course.deleteConfirmation.title", { name: getCourseName(courseState.course, i18n.resolvedLanguage as LanguageEnum) })} text={t("course.deleteConfirmation.text")}
                                    yesText={t("course.deleteConfirmation.yes")} noText={t("course.deleteConfirmation.no")}
                                    actionText={t("course.deleteConfirmation.action")}
                                    isAction={isDeleting}
                                    show={showDeleteConfirmation} handleResult={onDelete} />

                            </FormProvider>
                        </div>
                    </div>
                }
            </div>
        </ErrorBoundary>
    );
}

/*   // Watch the entire form
   const formData = watch(); 
 
    useEffect(() => {
   // Log the data to the console every time it changes
   console.log("Current Form Data:", formData); 
 }, [formData]); */


