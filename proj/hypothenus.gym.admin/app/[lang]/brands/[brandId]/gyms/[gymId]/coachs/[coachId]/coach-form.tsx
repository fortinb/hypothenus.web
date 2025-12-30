"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CoachInfo from "@/app/ui/components/coach/coach-info";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import ToastSuccess from "@/app/ui/components/notifications/toast-success";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { CoachState, updateCoachPhotoUri, updateCoachState } from "@/app/lib/store/slices/coach-state-slice";
import { Coach, CoachSchema } from "@/src/lib/entities/coach";
import { formatPersonName } from "@/src/lib/entities/person";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState, useTransition } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { uploadCoachPhoto } from "@/app/lib/data/coachs-data-service-client";
import { activateCoachAction, createCoachAction, deactivateCoachAction, deleteCoachAction, saveCoachAction } from "./actions";
import { ActionResult } from "@/app/lib/http/action-result";


export default function CoachForm({ lang, brandId, gymId, coachId, coach }: { lang: string; brandId: string; gymId: string, coachId: string, coach: Coach }) {
    const t = useTranslations("entity");
    const router = useRouter();
    const pathname = usePathname();

    const coachState: CoachState = useSelector((state: any) => state.coachState);
    const dispatch = useAppDispatch();

    const [isSaving, startTransitionSave] = useTransition();
    const [isActivating, startTransitionActivate] = useTransition();
    const [isDeleting, startTransitionDelete] = useTransition();
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [photoToUpload, setPhotoToUpload] = useState<Blob>();

    const formContext = useForm<Coach>({
        defaultValues: coach,
        resolver: zodResolver(CoachSchema),
    });

    const toggleSuccess = () => setSuccess(false);

    function handlePhotoToUpload(file: Blob) {
        setPhotoToUpload(file);
    }

    // Watch the entire form
    const formData = formContext.watch();
    useEffect(() => {
        // Log the data to the console every time there is an error
        const hasErrors = Object.keys(formContext?.formState?.errors).length > 0
        if (hasErrors) {
            console.log("Current Form errors:", formContext.formState.errors);
        }

        // console.log("Current Form Data:", formData);
    }, [formData]);

    useEffect(() => {
        dispatch(updateCoachState(coach));

        if (coachId === "new") {
            setIsEditMode(true);
        }

        // initBreadcrumb(formatPersonName(coachState.coach?.person))
    }, [dispatch, coach]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            reset: false,
            id: "coach.[coachId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const onSubmit: SubmitHandler<Coach> = (formData: z.infer<typeof CoachSchema>) => {
        setIsEditMode(false);

        let coach: Coach = mapForm(formData, coachState.coach);

        if (coachId == "new") {
            createCoach(coach);
        } else {
            saveCoach(coach);
        }
    }

    const uploadPhoto = async (gymId: string, coachId: string, photo: Blob) => {
        const formData = new FormData();
        formData.append('file', photo);

        let response = await uploadCoachPhoto(brandId, gymId, coachId, formData);

        return response;
    }

    const createCoach = (coach: Coach) => {
        startTransitionSave(async () => {
            let result: ActionResult<Coach> = await createCoachAction(brandId, gymId, coach);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.saveError"));
                setIsEditMode(true);
            } else {
                dispatch(updateCoachState(result.data));

                await afterSaveCoach(result.data);

                setTextSuccess(t("action.saveSuccess"));
                setSuccess(true);
                setIsEditMode(false);

                router.push(`/${lang}/brands/${coach.brandId}/gyms/${coach.gymId}/coachs/${result.data.id}`);
            }
        });
    }

    const saveCoach = (coach: Coach) => {
        startTransitionSave(async () => {
            let result: ActionResult<Coach> = await saveCoachAction(brandId, gymId, coachId, coach, `/${lang}/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.saveError"));
            } else {
                dispatch(updateCoachState(result.data));

                await afterSaveCoach(result.data);

                setTextSuccess(t("action.saveSuccess"));
                setSuccess(true);
                setIsEditMode(true);
            }
        });
    }

    const afterSaveCoach = async (coach: Coach) => {
        if (photoToUpload) {
            const photoUri = await uploadPhoto(coach.gymId, coach.id, photoToUpload);
            setPhotoToUpload(undefined);
            dispatch(updateCoachPhotoUri(photoUri));
        }
    }

    const activateCoach = async (gymId: string, coachId: string) => {
        startTransitionActivate(async () => {
            let result: ActionResult<Coach> = await activateCoachAction(brandId, gymId, coachId, `/${lang}/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.activationError"));
            } else {
                dispatch(updateCoachState(result.data));
                setTextSuccess(t("action.activationSuccess"));
                setSuccess(true);
            }
        });
    }

    const deactivateCoach = async (gymId: string, coachId: string) => {
        startTransitionActivate(async () => {
            let result: ActionResult<Coach> = await deactivateCoachAction(brandId, gymId, coachId, `/${lang}/brands/${brandId}/gyms/${gymId}/coachs/${coachId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.deactivationError"));
            } else {
                dispatch(updateCoachState(result.data));
                setTextSuccess(t("action.deactivationSuccess"));
                setSuccess(true);
            }
        });
    }

    const deleteCoach = async (gymId: string, coachId: string) => {
        startTransitionDelete(async () => {
            let result: ActionResult<void> = await deleteCoachAction(brandId, gymId, coachId);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.deleteError"));
            } else {
                setTextSuccess(t("action.deleteSuccess"));
                setSuccess(true);
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/brands/${brandId}/gyms/${gymId}/coachs`);

                }, 1000);
            }
        });
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);
        setPhotoToUpload(undefined);

        formContext.reset(coachState.coach);
        if (coachId == "new") {
            router.push(`/${lang}/brands/${brandId}/gyms/${gymId}/coachs`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
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
            brandId: formData.brandId,
            gymId: formData.gymId,
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

                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="coach_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={coachState.coach.id == "" ? true : coachState.coach.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(coachState.coach.id == null ? true : false)} isActivationDisabled={(coachState.coach.id == null ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <CoachInfo isEditMode={isEditMode} uploadHandler={handlePhotoToUpload} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="coach_info_form" />
                            </Form>

                            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                            <ModalConfirmation title={t("coach.deleteConfirmation.title", { name: formatPersonName(coachState.coach.person) })} text={t("coach.deleteConfirmation.text")}
                                yesText={t("coach.deleteConfirmation.yes")} noText={t("coach.deleteConfirmation.no")}
                                actionText={t("coach.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}