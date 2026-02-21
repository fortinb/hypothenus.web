"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import CoachInfo from "@/app/ui/components/coach/coach-info";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { clearCoachState, CoachState, updateCoachState } from "@/app/lib/store/slices/coach-state-slice";
import { Coach, CoachSchema } from "@/src/lib/entities/coach";
import { formatPersonName } from "@/src/lib/entities/person";
import { phoneNumberOrder } from "@/src/lib/entities/phoneNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { uploadCoachPhoto } from "@/app/lib/services/coachs-data-service-client";
import { activateCoachAction, createCoachAction, deactivateCoachAction, deleteCoachAction, saveCoachAction } from "./actions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { Authorize } from "@/app/ui/components/security/authorize";

export default function CoachForm({ lang, coach }: { lang: string; coach: Coach }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const coachState: CoachState = useSelector((state: any) => state.coachState);
    const gymState: GymState = useSelector((state: any) => state.gymState);
    const dispatch = useAppDispatch();

    // Form state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [photoToUpload, setPhotoToUpload] = useState<Blob>();
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Coach>({
        actions: {
            create: createCoachAction,
            save: saveCoachAction,
            activate: activateCoachAction,
            deactivate: deactivateCoachAction,
            delete: deleteCoachAction
        }
    });

    const formContext = useForm<z.infer<typeof CoachSchema>>({
        defaultValues: mapEntityToForm(coach),
        resolver: zodResolver(CoachSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    function handlePhotoToUpload(file: Blob) {
        setPhotoToUpload(file);
    }

    // Watch the entire form
    // const formData = formContext.watch();

    /*   useEffect(() => {
           // Log the data to the console every time there is an error
           const hasErrors = Object.keys(formContext?.formState?.errors).length > 0
           if (hasErrors) {
               console.log("Current Form errors:", formContext.formState.errors);
           }
   
           // console.log("Current Form Data:", formData);
       }, [formData]);
       */

    useEffect(() => {
        dispatch(updateCoachState(coach));

        if (coach.uuid === null) {
            setIsEditMode(true);
        }
    }, [dispatch, coach]);

    const onSubmit: SubmitHandler<z.infer<typeof CoachSchema>> = async (formData: z.infer<typeof CoachSchema>) => {
        setIsEditMode(false);

        let coach: Coach = mapFormToEntity(formData, coachState.coach);

        if (coach.uuid === null) {
            createCoach(coach);
        } else {
            saveCoach(coach);
        }
    }

    const uploadPhoto = async (brandUuid: string, gymUuid: string, coachUuid: string, photo: Blob) => {
        const formData = new FormData();
        formData.append('file', photo);

        let response = await uploadCoachPhoto(brandUuid, gymUuid, coachUuid, formData);
        return response;
    }

    const createCoach = (coach: Coach) => {
        coach.brandUuid = gymState.gym.brandUuid;
        coach.gymUuid = gymState.gym.uuid;

        createEntity(
            coach,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            async (entity) => {
                dispatch(updateCoachState(entity));

                showResultToast(true, t("action.saveSuccess"));
                router.push(`/${lang}/admin/brands/${entity.brandUuid}/gyms/${entity.gymUuid}/coachs/${entity.uuid}`);
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveCoach = (coach: Coach) => {
        saveEntity(
            coach, `/${lang}/admin/brands/${coach.brandUuid}/gyms/${coach.gymUuid}/coachs/${coach.uuid}`,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            async (entity) => {
                dispatch(updateCoachState(entity));

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

    const beforeSave = async (coach: Coach) => {
        if (photoToUpload) {
            const photoUri = await uploadPhoto(coach.brandUuid, coach.gymUuid, coach.uuid, photoToUpload);
            coach.person.photoUri = photoUri;
            setPhotoToUpload(undefined);
        }
    }

    const activateCoach = (coach: Coach) => {
        activateEntity(
            coach, `/${lang}/admin/brands/${coach.brandUuid}/gyms/${coach.gymUuid}/coachs/${coach.uuid}`,
            (entity) => {
                dispatch(updateCoachState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateCoach = (coach: Coach) => {
        deactivateEntity(
            coach, `/${lang}/admin/brands/${coach.brandUuid}/gyms/${coach.gymUuid}/coachs/${coach.uuid}`,
            (entity) => {
                dispatch(updateCoachState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteCoach = (coach: Coach) => {
        deleteEntity(
            coach, `/${lang}/admin/brands/${coach.brandUuid}/gyms/${coach.gymUuid}/coachs/${coach.uuid}`,
            () => {
                dispatch(clearCoachState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${coach.brandUuid}/gyms/${coach.gymUuid}/coachs`);
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
        setPhotoToUpload(undefined);

        formContext.reset(coachState.coach);

        if (coachState.coach.uuid === null) {
            router.push(`/${lang}/admin/brands/${coachState.coach.brandUuid}/gyms/${coachState.coach.gymUuid}/coachs`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateCoach(coachState.coach);
        } else {
            deactivateCoach(coachState.coach);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (coachState.coach.uuid !== null) {

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
            deleteCoach(coachState.coach);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (coachState.coach.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(coach: Coach): z.infer<typeof CoachSchema> {
        const person = { ...coach.person };

        // Sort the phoneNumbers array by the predefined order (Business -> Mobile -> Home)
        person.phoneNumbers = [...coach.person.phoneNumbers].sort((a, b) => {
            const orderA = phoneNumberOrder[a.type];
            const orderB = phoneNumberOrder[b.type];
            return orderA - orderB;
        });

        return {
            person: person
        };
    }

    function mapFormToEntity(formData: z.infer<typeof CoachSchema>, coach: Coach): Coach {
        return {
            ...coach,  // Preserve original properties like id, isActive, messages, etc.
            person: formData.person,
        };
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
                                <Authorize roles="manager">
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={coachState.coach.uuid == null ? true : coachState.coach.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(coachState.coach.uuid == null ? true : false)} isActivationDisabled={(coachState.coach.uuid == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                </Authorize>
                                <CoachInfo isEditMode={isEditMode} uploadHandler={handlePhotoToUpload} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="coach_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
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