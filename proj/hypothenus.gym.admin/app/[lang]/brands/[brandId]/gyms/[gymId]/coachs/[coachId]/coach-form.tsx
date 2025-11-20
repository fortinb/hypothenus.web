"use client"

import FormActionBar from "@/app/[lang]/components/actions/form-action-bar";
import FormActionButtons from "@/app/[lang]/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/[lang]/components/actions/modal-confirmation";
import CoachInfo from "@/app/[lang]/components/coach/coach-info";
import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import Loader from "@/app/[lang]/components/navigation/loader";
import ToastSuccess from "@/app/[lang]/components/notifications/toast-success";
import i18n, { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { CoachState, updateCoachPhotoUri, updateCoachState } from "@/app/lib/store/slices/coach-state-slice";
import { Coach, CoachSchema } from "@/src/lib/entities/coach";
import { formatName } from "@/src/lib/entities/person";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";


export default function CoachForm({ brandId, gymId, coachId }: { brandId: string; gymId: string, coachId: string }) {
    const { t } = useTranslation("entity");
    const router = useRouter();
    const pathname = usePathname();

    const coachState: CoachState = useSelector((state: any) => state.coachState);
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
    const [photoToUpload, setPhotoToUpload] = useState<Blob>();

    const formContext = useForm<Coach>({
        defaultValues: coachState.coach,
        resolver: zodResolver(CoachSchema),
    });

    const toggleSuccess = () => setSuccess(false);

    function handlePhotoToUpload(file: Blob) {
        setPhotoToUpload(file);
    }

    useEffect(() => {
        if (isLoading && coachId !== "new") {
            if (coachState.coach?.id == coachId) {
                initBreadcrumb(formatName(coachState.coach?.person))
                setIsLoading(false);
            } else {
                fetchCoach(gymId, coachId);
            }
        }

        if (isLoading && coachId == "new") {
            initBreadcrumb(t("coach.navigation.new"));
            setIsEditMode(true);
            
            formContext.setValue("brandId", brandId);
            formContext.setValue("gymId", gymId);
            setIsLoading(false);
        }

        if (!isLoading) {
            formContext.reset(coachState.coach);
            initBreadcrumb(formatName(coachState.coach?.person))
        }
    }, [coachState]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            id: "coach.[coachId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const fetchCoach = async (gymId: string, coachId: string) => {
        let response = await axiosInstance.get(`/api/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`);
        let coach: Coach = response.data;
        dispatch(updateCoachState(coach));

        setIsLoading(false);
    }

    const onSubmit: SubmitHandler<Coach> = (formData: z.infer<typeof CoachSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (coachState.coach.id == null) {
            createCoach(formData);
        } else {
            saveCoach(formData);
        }
    }

    const uploadPhoto = async (gymId: string, coachId: string, photo: Blob) => {
        const formData = new FormData();
        formData.append('file', photo);

        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/photo`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data as string;
    }

    const createCoach = async (formData: z.infer<typeof CoachSchema>) => {

        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${formData.gymId}/coachs`, formData);
        let coach: Coach = response.data;

        dispatch(updateCoachState(coach));

        await postSaveCoach(coach);

        router.push(`/${i18n.resolvedLanguage}/brands/${coach.brandId}/gyms/${coach.gymId}/coachs/${coach.id}`);
    }

    const saveCoach = async (formData: z.infer<typeof CoachSchema>) => {
        let updatedCoach: Coach = mapForm(formData, coachState.coach);

        let response = await axiosInstance.put(`/api/brands/${brandId}/gyms/${formData.gymId}/coachs/${updatedCoach.id}`, updatedCoach);
        let coach: Coach = response.data as Coach;

        dispatch(updateCoachState(coach));

        await postSaveCoach(updatedCoach);
    }

    const postSaveCoach = async (coach: Coach) => {

        if (photoToUpload) {
            const photoUri = await uploadPhoto(coach.gymId, coach.id, photoToUpload);
            setPhotoToUpload(undefined);
            dispatch(updateCoachPhotoUri(photoUri));
        }

        setTextSuccess(t("action.saveSuccess"));
        setSuccess(true);
        setIsSaving(false);
    }

    const activateCoach = async (gymId: string, coachId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/activate`);
        let coach: Coach = response.data;

        dispatch(updateCoachState(coach));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateCoach = async (gymId: string, coachId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/coachs/${coachId}/deactivate`);
        let coach: Coach = response.data;

        dispatch(updateCoachState(coach));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteCoach = async (gymId: string, coachId: string) => {
        await axiosInstance.delete(`/api/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`);

        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/${i18n.resolvedLanguage}/brands/${brandId}/gyms/${gymId}/coachs`);
        }, 2000);
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);
        setPhotoToUpload(undefined);

        formContext.reset(coachState.coach);
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        setIsActivating(true);
        if (e.currentTarget.checked) {
            activateCoach(coachState.coach.gymId, coachState.coach.id);
        } else {
            deactivateCoach(coachState.coach.gymId, coachState.coach.id);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (coachState.coach.id !== "") {
           
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
            deleteCoach(coachState.coach.gymId, coachState.coach.id);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (coachState.coach.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapForm(formData: z.infer<typeof CoachSchema>, coach: Coach): Coach {
        let updatedCoach: Coach = {
            id: coach.id,
            brandId: coach.brandId,
            gymId: coach.gymId,
            isActive: coach.isActive,
            person: formData.person,
            messages: undefined,
            createdBy: undefined,
            modifiedBy: undefined
        };

        return updatedCoach;
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
                                <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="coach_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={coachState.coach.id == "" ? true : coachState.coach.isActive}
                                        isDeleteDisable={(coachState.coach.id == null ? true : false)} isActivationDisabled={(coachState.coach.id == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                    <CoachInfo isEditMode={isEditMode} uploadHandler={handlePhotoToUpload} isCancelling={isCancelling}/>
                                    <hr className="mt-1 mb-1" />
                                    <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="coach_info_form" />
                                </Form>

                                <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                                <ModalConfirmation title={t("coach.deleteConfirmation.title", { name: formatName(coachState.coach.person) })} text={t("coach.deleteConfirmation.text")}
                                    yesText={t("coach.deleteConfirmation.yes")} noText={t("coach.deleteConfirmation.no")}
                                    actionText={t("coach.deleteConfirmation.action")}
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