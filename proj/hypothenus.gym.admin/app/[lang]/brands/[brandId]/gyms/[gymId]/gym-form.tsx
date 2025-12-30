"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import GymInfo from "@/app/ui/components/gym/gym-info";
import ToastSuccess from "@/app/ui/components/notifications/toast-success";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import { Gym, GymSchema } from "@/src/lib/entities/gym";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState, useTransition } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { activateGymAction, createGymAction, deactivateGymAction, deleteGymAction, saveGymAction } from "./actions";
import { ActionResult } from "@/app/lib/http/action-result";

export default function GymForm({ lang, brandId, gymId, gym }: { lang: string; brandId: string; gymId: string, gym: Gym }) {
    const t = useTranslations("entity");
    const router = useRouter();
    const pathname = usePathname();

    const gymState: GymState = useSelector((state: any) => state.gymState);
    const dispatch = useAppDispatch();
    const [isSaving, startTransitionSave] = useTransition();
    const [isActivating, startTransitionActivate] = useTransition();
    const [isDeleting, startTransitionDelete] = useTransition();
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggleSuccess = () => setSuccess(false);

    const formContext = useForm<Gym>({
        defaultValues: gym,
        resolver: zodResolver(GymSchema),
    });

    useEffect(() => {
        dispatch(updateGymState(gym));

        if (gymId === "new") {
            setIsEditMode(true);
        }

        //   initBreadcrumb(gymState.gym?.name);
    }, [dispatch, gym]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            reset: false,
            id: "gym.[gymId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const onSubmit: SubmitHandler<Gym> = (formData: z.infer<typeof GymSchema>) => {
        setIsEditMode(false);

        let gym: Gym = mapForm(formData, gymState.gym);

        if (gymId === "new") {
            createGym(gym);
        } else {
            saveGym(gym);
        }
    }

    const createGym = (gym: Gym) => {
        startTransitionSave(async () => {
            let result: ActionResult<Gym> = await createGymAction(brandId, gym);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.saveError"));
                setIsEditMode(true);
            } else {
                const duplicate = result.data.messages?.find(m => m.code == DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("gymId", { type: "manual", message: t("gym.validation.alreadyExists") });
                    setIsEditMode(true);
                } else {
                    setSuccess(true);
                    setTextSuccess(t("action.saveSuccess"));
                    dispatch(updateGymState(result.data));

                    router.push(`/${lang}/brands/${result.data.brandId}/gyms/${result.data.gymId}`);
                }
            }
        });
    }

    const saveGym = (gym: Gym) => {
        startTransitionSave(async () => {
            let result: ActionResult<Gym> = await saveGymAction(brandId, gymId, gym, `/${lang}/brands/${brandId}/gyms/${gymId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.saveError"));
            } else {
                dispatch(updateGymState(result.data));

                setTextSuccess(t("action.saveSuccess"));
                setSuccess(true);

                setIsEditMode(true);
            }
        });
    }

    const activateGym = async (gymId: string) => {
        startTransitionActivate(async () => {
            let result: ActionResult<Gym> = await activateGymAction(brandId, gymId, `/${lang}/brands/${brandId}/gyms/${gymId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.activationError"));
            } else {
                dispatch(updateGymState(result.data));
                setTextSuccess(t("action.activationSuccess"));
                setSuccess(true);
            }
        });
    }

    const deactivateGym = async (gymId: string) => {
        startTransitionActivate(async () => {
            let result: ActionResult<Gym> = await deactivateGymAction(brandId, gymId, `/${lang}/brands/${brandId}/gyms/${gymId}`);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.deactivationError"));
            } else {
                dispatch(updateGymState(result.data));
                setTextSuccess(t("action.deactivationSuccess"));
                setSuccess(true);
            }
        });
    }

    const deleteGym = async (gymId: string) => {
        startTransitionDelete(async () => {
            let result: ActionResult<void> = await deleteGymAction(brandId, gymId);
            if (!result.ok) {
                setSuccess(false);
                setTextSuccess(t("action.deleteError"));
            } else {
                setTextSuccess(t("action.deleteSuccess"));
                setSuccess(true);
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/brands/${brandId}/gyms`);

                }, 1000);
            }
        });
    }

    function onCancel() {
        setIsEditMode(false);
        formContext.reset(gymState.gym);

        if (gymId == "new") {
            router.push(`/${lang}/brands/${brandId}/gyms`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateGym(gymState.gym.gymId);
        } else {
            deactivateGym(gymState.gym.gymId);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (gymState.gym.id !== "") {
            if (isEditMode === true) {
                onCancel();
            } else {
                setIsEditMode(true);

            }
        }
    }

    function onDelete(confirmation: boolean) {
        if (confirmation) {
            deleteGym(gymState.gym.gymId);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (gymState.gym.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapForm(formData: z.infer<typeof GymSchema>, gym: Gym): Gym {
        let updatedGym: Gym = {
            id: gym.id,
            brandId: formData.brandId,
            gymId: formData.gymId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            isActive: gym.isActive,
            note: formData.note,
            contacts: formData.contacts,
            phoneNumbers: formData.phoneNumbers,
            messages: undefined,
            createdBy: undefined,
            modifiedBy: undefined
        };

        return updatedGym;
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
                                <GymInfo gym={gymState.gym} isEditMode={isEditMode} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="gym_info_form" />
                            </Form>

                            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
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
