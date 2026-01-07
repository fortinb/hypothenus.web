"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import GymInfo from "@/app/ui/components/gym/gym-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { clearGymState, GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import { Gym, GymSchema } from "@/src/lib/entities/gym";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { activateGymAction, createGymAction, deactivateGymAction, deleteGymAction, saveGymAction } from "./actions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { uploadGymLogo } from "@/app/lib/services/gyms-data-service-client";
import { phoneNumberOrder } from "@/src/lib/entities/phoneNumber";

export default function GymForm({ lang, brandId, gymId, gym }: { lang: string; brandId: string; gymId: string, gym: Gym }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const gymState: GymState = useSelector((state: any) => state.gymState);
    const dispatch = useAppDispatch();

    // Form State
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [logoToUpload, setLogoToUpload] = useState<Blob>();
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Gym>({
        actions: {
            create: createGymAction,
            save: saveGymAction,
            activate: activateGymAction,
            deactivate: deactivateGymAction,
            delete: deleteGymAction
        }
    });

    const formContext = useForm<z.infer<typeof GymSchema>>({
        defaultValues: mapEntityToForm(gym),
        resolver: zodResolver(GymSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    function handleLogoToUpload(file: Blob) {
        setLogoToUpload(file);
    }

    useEffect(() => {
        dispatch(updateGymState(gym));

        if (gymId === "new") {
            setIsEditMode(true);
        }
    }, [dispatch, gym, gymId]);

    const onSubmit: SubmitHandler<z.infer<typeof GymSchema>> = (formData: z.infer<typeof GymSchema>) => {
        setIsEditMode(false);

        let gym: Gym = mapFormToEntity(formData, gymState.gym);

        if (gymId === "new") {
            createGym(gym);
        } else {
            saveGym(gym);
        }
    }

    const uploadLogo = async (gymId: string, logo: Blob) => {
        const formData = new FormData();
        formData.append('file', logo);

        let response = await uploadGymLogo(brandId, gymId, formData);

        return response;
    }

    const createGym = (gym: Gym) => {
        createEntity(
            gym,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("gymId", { type: "manual", message: t("gym.validation.alreadyExists") });
                    setIsEditMode(true);
                } else {
                    dispatch(updateGymState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${brandId}/gyms/${entity.gymId}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveGym = (gym: Gym) => {
        saveEntity(
            gymId, gym, `/${lang}/admin/brands/${brandId}/gyms/${gymId}`,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            (entity) => {
                dispatch(updateGymState(entity));
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

    const beforeSave = async (gym: Gym) => {
        if (logoToUpload) {
            const logoUri = await uploadLogo(gym.gymId, logoToUpload);
            gym.logoUri = logoUri;
            setLogoToUpload(undefined);
        }
    }

    const activateGym = (gym: Gym) => {
        activateEntity(
            gymId, gym, `/${lang}/admin/brands/${brandId}/gyms/${gymId}`,
            (entity) => {
                dispatch(updateGymState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateGym = (gym: Gym) => {
        deactivateEntity(
            gymId, gym, `/${lang}/admin/brands/${brandId}/gyms/${gymId}`,
            (entity) => {
                dispatch(updateGymState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteGym = (gym: Gym) => {
        deleteEntity(
            gymId, gym, `/${lang}/admin/brands/${brandId}/gyms/${gymId}`,
            () => {
                dispatch(clearGymState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${brandId}/gyms`);
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
        formContext.reset(gymState.gym);

        if (gymId == "new") {
            router.push(`/${lang}/admin/brands/${brandId}/gyms`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateGym(gymState.gym);
        } else {
            deactivateGym(gymState.gym);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (gymState.gym.id !== "") {
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
            deleteGym(gymState.gym);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (gymState.gym.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(gym: Gym): z.infer<typeof GymSchema> {
        return {
            gymId: gym.gymId,
            name: gym.name,
            address: gym.address,
            email: gym.email,
            note: gym.note,
            contacts: gym.contacts,
            phoneNumbers: [...gym.phoneNumbers].sort((a, b) => {
                const orderA = phoneNumberOrder[a.type] ?? 999;
                const orderB = phoneNumberOrder[b.type] ?? 999;
                return orderA - orderB;
            }),
        };
    }

    function mapFormToEntity(formData: z.infer<typeof GymSchema>, gym: Gym): Gym {
        return {
            ...gym,  // Preserve original properties like id, isActive, messages, etc.
            gymId: formData.gymId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            note: formData.note,
            contacts: formData.contacts,
            phoneNumbers: formData.phoneNumbers,
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gymState.gym.gymId == "" ? true : gymState.gym.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(gymState.gym.id == null ? true : false)} isActivationDisabled={(gymState.gym.gymId == "" ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <GymInfo gym={gymState.gym} isEditMode={isEditMode} uploadHandler={handleLogoToUpload} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="gym_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("gym.deleteConfirmation.title", { name: gymState.gym.name })} text={t("gym.deleteConfirmation.text")}
                                yesText={t("gym.deleteConfirmation.yes")} noText={t("gym.deleteConfirmation.no")}
                                actionText={t("gym.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
