"use client"

import FormActionBar from "@/app/[lang]/components/actions/form-action-bar";
import FormActionButtons from "@/app/[lang]/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/[lang]/components/actions/modal-confirmation";
import CourseInfo from "@/app/[lang]/components/course/course-info";
import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import Loader from "@/app/[lang]/components/navigation/loader";
import ToastSuccess from "@/app/[lang]/components/notifications/toast-success";
import i18n, { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { CourseState, updateCourseState } from "@/app/lib/store/slices/course-state-slice";
import { Course, CourseSchema, getCourseName } from "@/src/lib/entities/course";
import { LanguageEnum } from "@/src/lib/entities/language";
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";


export default function CourseForm({ gymId, courseId }: { gymId: string, courseId: string }) {
    const { t } = useTranslation("entity");
    const router = useRouter();
    const pathname = usePathname();

    const courseState: CourseState = useSelector((state: any) => state.courseState);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const formContext = useForm<Course>({
        defaultValues: courseState.course,
        resolver: zodResolver(CourseSchema),
    });

    const toggleSuccess = () => setSuccess(false);

    useEffect(() => {
        if (isLoading && courseId !== "new") {
            if (courseState.course?.id == courseId) {
                initBreadcrumb(getCourseName(courseState.course, i18n.resolvedLanguage as LanguageEnum));
                setIsLoading(false);
            } else {
                fetchCourse(gymId, courseId);
            }
        }

        if (isLoading && courseId == "new") {
            initBreadcrumb(t("course.navigation.new"));
            setIsEditMode(true);

            formContext.setValue("gymId", gymId);
            setIsLoading(false);
        }

        if (!isLoading) {
            formContext.reset(courseState.course);
            initBreadcrumb(getCourseName(courseState.course, i18n.resolvedLanguage as LanguageEnum))
        }
    }, [courseState]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            id: "course.[courseId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const fetchCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.get(`/api/gyms/${gymId}/courses/${courseId}`);
        let course: Course = response.data;
        dispatch(updateCourseState(course));

        setIsLoading(false);
    }

    const onSubmit: SubmitHandler<Course> = (formData: z.infer<typeof CourseSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (courseState.course.id == null) {
            createCourse(formData);
        } else {
            saveCourse(formData);
        }
    }

    const createCourse = async (formData: z.infer<typeof CourseSchema>) => {
        let response = await axiosInstance.post(`/api/gyms/${formData.gymId}/courses`, formData);
        let course: Course = response.data;

        const duplicate = course.messages?.find(m => m.code == DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST)
        if (duplicate) {
            formContext.setError("code", { type: "manual", message: t("course.validation.alreadyExists")});
            setIsEditMode(true);
        } else {
            setSuccess(true);
            setTextSuccess(t("action.saveSuccess"));
            dispatch(updateCourseState(course));

            await postSaveCourse(course);

            router.push(`/${i18n.resolvedLanguage}/gyms/${course.gymId}/courses/${course.id}`);
        }
    }

    const saveCourse = async (formData: z.infer<typeof CourseSchema>) => {
        let updatedCourse: Course = mapForm(formData, courseState.course);

        let response = await axiosInstance.put(`/api/gyms/${formData.gymId}/courses/${updatedCourse.id}`, updatedCourse);
        let course: Course = response.data as Course;

        dispatch(updateCourseState(course));

        await postSaveCourse(updatedCourse);
    }

    const postSaveCourse = async (course: Course) => {
        setTextSuccess(t("action.saveSuccess"));
        setSuccess(true);
        setIsSaving(false);
    }

    const activateCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.post(`/api/gyms/${gymId}/courses/${courseId}/activate`);
        let course: Course = response.data;

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateCourse = async (gymId: string, courseId: string) => {
        let response = await axiosInstance.post(`/api/gyms/${gymId}/courses/${courseId}/deactivate`);
        let course: Course = response.data;

        dispatch(updateCourseState(course));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteCourse = async (gymId: string, courseId: string) => {
        await axiosInstance.delete(`/api/gyms/${gymId}/courses/${courseId}`);

        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/gyms/${gymId}/courses`);
        }, 2000);
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);

        formContext.reset(courseState.course);
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

    function mapForm(formData: z.infer<typeof CourseSchema>, course: Course): Course {
        let updatedCourse: Course = {
            id: course.id,
            gymId: course.gymId,
            code: formData.code,
            name: formData.name,
            description: formData.description,
            isActive: course.isActive,
            messages: undefined,
            createdBy: undefined,
            modifiedBy: undefined
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
                                         isDeleteDisable={(courseState.course.id == null ? true : false)} isActivationDisabled={(courseState.course.id == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                    <CourseInfo course={courseState.course} isEditMode={isEditMode} isCancelling={isCancelling}/>
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


