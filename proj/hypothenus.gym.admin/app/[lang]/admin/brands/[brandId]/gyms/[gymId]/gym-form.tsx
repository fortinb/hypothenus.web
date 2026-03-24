"use client"

import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { uploadGymLogo } from "@/app/lib/services/gyms-data-service-client";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { clearGymState, GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import GymInfo from "@/app/ui/components/gym/gym-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Authorize } from "@/app/ui/components/security/authorize";
import { Gym, GymSchema } from "@/src/lib/entities/gym";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { phoneNumberOrder } from "@/src/lib/entities/phone-number";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, Resolver, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { activateGymAction, createGymAction, deactivateGymAction, deleteGymAction, saveGymAction } from "./actions";
import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";
import { Coach } from "@/src/lib/entities/coach";

export interface GymFormData {
    gym: z.infer<typeof GymSchema>;
    selectedCoachItems: CoachSelectedItem[];
}

export const GymFormSchema = z.object({
    gym: GymSchema,
    selectedCoachItems: z.any().array()
});

export default function GymForm({ lang, gym, initialAvailableCoachItems, initialSelectedCoachItems }:
    {
        lang: string;
        gym: Gym;
        initialAvailableCoachItems: CoachSelectedItem[];
        initialSelectedCoachItems: CoachSelectedItem[]
    }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const gymState: GymState = useSelector((state: any) => state.gymState);
    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form State
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isCoachItemsInitialized, setIsCoachItemsInitialized] = useState<boolean>(false);
    const [availableCoachItems, setAvailableCoachItems] = useState<CoachSelectedItem[]>([]);
    const [originalSelectedCoachItems, setOriginalSelectedCoachItems] = useState<CoachSelectedItem[]>([]);

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

    const formContext = useForm<GymFormData>({
        defaultValues: {
            gym: mapEntityToForm(gym),
            selectedCoachItems: initialSelectedCoachItems
        },
        mode: "all",
        resolver: zodResolver(GymFormSchema) as Resolver<GymFormData>
    });

    const { fields: coachFields } = useFieldArray({
        control: formContext.control,
        name: "selectedCoachItems"
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    function handleLogoToUpload(file: Blob) {
        setLogoToUpload(file);
    }

    useEffect(() => {
        dispatch(updateGymState(gym));

        if (gym.uuid === null) {
            setIsEditMode(true);
        }

        // Initialize Coach Items
        if (!isCoachItemsInitialized) {
            setOriginalSelectedCoachItems(initialSelectedCoachItems);
            setAvailableCoachItems(initialAvailableCoachItems);

            setIsCoachItemsInitialized(true);
        }
    }, [dispatch, gym, initialAvailableCoachItems, initialSelectedCoachItems, isCoachItemsInitialized]);

    const onSubmit: SubmitHandler<GymFormData> = (formData: z.infer<typeof GymFormSchema>) => {
        setIsEditMode(false);

        let gym: Gym = mapFormToEntity(formData, gymState.gym);

        if (gym.uuid === null) {
            createGym(gym);
        } else {
            saveGym(gym);
        }
    }

    // Watch the entire form and log errors when present (debug only)
    useFormDebug(formContext);

    const uploadLogo = async (brandUuid: string, gymUuid: string, logo: Blob) => {
        const formData = new FormData();
        formData.append('file', logo);

        let response = await uploadGymLogo(brandUuid, gymUuid, formData);
        return response;
    }

    const createGym = (gym: Gym) => {
        gym.brandUuid = brandState.brand.uuid;
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
                    formContext.setError("gym.code", { type: "manual", message: "gym.validation.alreadyExists" });
                    showResultToast(false, t("action.saveError"), undefined);
                    setIsEditMode(true);
                } else {
                    dispatch(updateGymState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${entity.brandUuid}/gyms/${entity.uuid}`);
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
            gym, `/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}`,
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
            const logoUri = await uploadLogo(gym.brandUuid, gym.uuid, logoToUpload);
            gym.logoUri = logoUri;
            setLogoToUpload(undefined);
        }
    }

    const activateGym = (gym: Gym) => {
        activateEntity(
            gym, `/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}`,
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
            gym, `/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}`,
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
            gym, `/${lang}/admin/brands/${gym.brandUuid}/gyms/${gym.uuid}`,
            () => {
                dispatch(clearGymState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${brandState?.brand?.uuid}/gyms`);
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
            gym: mapEntityToForm(gymState.gym),
            selectedCoachItems: originalSelectedCoachItems
        });

        if (gymState.gym.uuid === null) {
            router.push(`/${lang}/admin/brands/${brandState?.brand?.uuid}/gyms`);
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
        if (gymState.gym.uuid !== null) {
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
        if (gymState.gym.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(gym: Gym): z.infer<typeof GymSchema> {
        return {
            code: gym.code,
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
            coachs: gym.coachs?.map((coach) => {
                return {
                    uuid: coach.uuid,
                    brandUuid: coach.brandUuid,
                }
            }),
        };
    }

    function mapFormToEntity(formData: z.infer<typeof GymFormSchema>, gym: Gym): Gym {
        return {
            ...gym,  // Preserve original properties like id, isActive, messages, etc.
            code: formData.gym.code,
            name: formData.gym.name,
            address: formData.gym.address,
            email: formData.gym.email,
            note: formData.gym.note,
            contacts: formData.gym.contacts,
            phoneNumbers: formData.gym.phoneNumbers,
            coachs: formData.selectedCoachItems.map((item) => {
                return item.coach as Coach;
            }),
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <Authorize roles="manager">
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gymState.gym.uuid == null ? true : gymState.gym.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(gymState.gym.uuid == null ? true : false)} isActivationDisabled={(gymState.gym.uuid == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                </Authorize>
                                <GymInfo gym={gymState.gym} uploadHandler={handleLogoToUpload}
                                    availableCoachItems={availableCoachItems}
                                    formCoachsStateField="selectedCoachItems"
                                    isEditMode={isEditMode} isCancelling={isCancelling}
                                    />
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
        </>
    );
}
