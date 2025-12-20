"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CourseInfo, { SelectItem } from "@/app/ui/components/course/course-info";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import Loader from "@/app/ui/components/navigation/loader";
import ToastSuccess from "@/app/ui/components/notifications/toast-success";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { CourseState, updateCourseState } from "@/app/lib/store/slices/course-state-slice";
import { Coach } from "@/src/lib/entities/coach";
import { Course, CourseSchema, getCourseName, parseCourse } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { formatPersonName } from "@/src/lib/entities/person";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { delCourse, postActivateCourse, getCourse, postCourse, putCourse, postDeactivateCourse } from "@/app/lib/data/courses-data-service";
import { fetchCoachs } from "@/app/lib/data/coachs-data-service";
import { Page } from "@/src/lib/entities/page";

export interface CourseFormData {
    course: Course;
    selectedCoachItems: SelectItem[];
}

export const CourseFormSchema = z.object({
    course: CourseSchema,
    selectedCoachItems: z.any().array().min(0)
});

export default function CourseForm({ brandId, gymId, courseId }: { brandId: string; gymId: string, courseId: string }) {
    const t = useTranslations("entity");
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams<{ lang: string }>();
    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false);
    const [isCourseLoaded, setIsCourseLoaded] = useState<boolean>(false);
    const [isCoachsLoading, setIsCoachsLoading] = useState<boolean>(false);
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
    const [availableCoachItems, setAvailableCoachItems] = useState<SelectItem[]>([]);
    const [initialSelectedCoachItems, setInitialSelectedCoachItems] = useState<SelectItem[]>([]);

    const formContext = useForm<CourseFormData>({
        defaultValues: {
            course: courseState.course,
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
        if (isLoading) {
            if (courseId !== "new" && !isCourseLoaded && !isCourseLoading) {
                fetchCourse(gymId, courseId);
                setIsCourseLoading(true);
            }

            if (!isCoachsLoaded && !isCoachsLoading) {
                fetchCoachsPage(brandId, gymId);
                setIsCoachsLoading(true);
            }

            if (courseId == "new") {
                setIsEditMode(true);
                formContext.setValue("course.brandId", brandId);
                formContext.setValue("course.gymId", gymId);
                setIsLoading(false);
            }
        }

        // Initialize DualList Coachs Items
        if (isCoachsLoaded && !isCoachsItemsInitialized) {
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

        if (isCoachsLoaded && isCourseLoaded && isCoachsItemsInitialized && courseId !== "new") {
            const initialSelectedCoachItems: SelectItem[] = initSelectedCoachItems();
            setInitialSelectedCoachItems(initialSelectedCoachItems);

            formContext.reset({
                course: courseState.course,
                selectedCoachItems: initialSelectedCoachItems
            },);

            initBreadcrumb(getCourseName(courseState.course, params.lang as LanguageEnum));
            setIsLoading(false);
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

    function initSelectedCoachItems() : SelectItem[] {
        const initialSelectedCoachItems: SelectItem[] = courseState.course.coachs?.map((coach: Coach) => {
            return {
                coach: coach,
                label: formatPersonName(coach.person),
                value: coach.id,
            } as SelectItem;
        });

    
        return initialSelectedCoachItems;
    }

    const fetchCourse = async (gymId: string, courseId: string) => {
        let course: Course = await getCourse(brandId, gymId, courseId);

        dispatch(updateCourseState(course));
        setIsCourseLoaded(true);
    }

    const fetchCoachsPage = async (brandId: string, gymId: string) => {
        let pageOfCoachs: Page<Coach> =  await fetchCoachs(brandId, gymId, 0, 1000, false);
        let coachs: Coach[] = pageOfCoachs.content;

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

            router.push(`/${params.lang}/brands/${course.brandId}/gyms/${course.gymId}/courses/${course.id}`);
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
    }

    const activateCourse = async (gymId: string, courseId: string) => {
        let course: Course =  await postActivateCourse(brandId, gymId, courseId);

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateCourse = async (gymId: string, courseId: string) => {
        let course: Course =  await postDeactivateCourse(brandId, gymId, courseId);

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
            router.push(`/${params.lang}/brands/${brandId}/gyms/${gymId}/courses`);
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
            router.push(`/${params.lang}/brands/${brandId}/gyms/${gymId}/courses`);
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

                {isLoading &&
                    <div className="flex-fill w-100 h-100">
                        <Loader />
                    </div>
                }

                {!isLoading && 
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
                                <ModalConfirmation title={t("course.deleteConfirmation.title", { name: getCourseName(courseState.course, params.lang as LanguageEnum) })} text={t("course.deleteConfirmation.text")}
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


