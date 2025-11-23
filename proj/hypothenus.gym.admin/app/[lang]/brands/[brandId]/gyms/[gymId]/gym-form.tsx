"use client"

import FormActionBar from "@/app/[lang]/components/actions/form-action-bar";
import FormActionButtons from "@/app/[lang]/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/[lang]/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import GymInfo from "@/app/[lang]/components/gym/gym-info";
import Loader from "@/app/[lang]/components/navigation/loader";
import ToastSuccess from "@/app/[lang]/components/notifications/toast-success";
import i18n, { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import { Gym, GymSchema } from "@/src/lib/entities/gym";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

export default function GymForm({ brandId, gymId }: { brandId: string; gymId: string }) {
    const { t } = useTranslation("entity");
    const router = useRouter();
    const pathname = usePathname();

    const gymState: GymState = useSelector((state: any) => state.gymState);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggleSuccess = () => setSuccess(false);

    const formContext = useForm<Gym>({
        defaultValues: gymState.gym,
        resolver: zodResolver(GymSchema),
    });
   
    useEffect(() => {
        if (isLoading && gymId !== "new") {
            if (gymState.gym?.gymId == gymId) {
                initBreadcrumb(gymState.gym?.name);
                setIsLoading(false);
            } else {
                fetchGym(gymId);
            }
        }

        if (isLoading && gymId == "new") {
            formContext.setValue("brandId", brandId);
            
            setIsEditMode(true);
            setIsLoading(false);
        }

        if (!isLoading) {
            formContext.reset(gymState.gym);
            initBreadcrumb(gymState.gym?.name);
        }
    }, [gymState]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            id: "gym.[gymId].page",
            href: pathname,
            crumb: name
          };

        dispatch(pushBreadcrumb(crumb));
    }

    const fetchGym = async (gymId: string) => {
        let response = await axiosInstance.get(`/api/brands/${brandId}/gyms/${gymId}`);
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));

        initBreadcrumb(gym?.name);
       
        setIsLoading(false);
    }

    const onSubmit: SubmitHandler<Gym> = (formData: z.infer<typeof GymSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (gymState.gym.id == null) {
            createGym(formData);
        } else {
            saveGym(formData);
        }
    }

    const createGym = async (formData: z.infer<typeof GymSchema>) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms`, formData);

        let result: Gym = response.data;
        const duplicate = result.messages?.find(m => m.code == DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST)
        if (duplicate) {
            formContext.setError("gymId", { type: "manual", message: t("gym.validation.alreadyExists")});
            setIsEditMode(true);
        } else {
            setSuccess(true);
            setTextSuccess(t("action.saveSuccess"));
            dispatch(updateGymState(result));
            router.push(`/${i18n.resolvedLanguage}/brands/${result.brandId}/gyms/${result.gymId}`);
        }
      
        setIsSaving(false);
    }

    const saveGym = async (formData: z.infer<typeof GymSchema>) => {
        let updatedGym: Gym = mapForm(formData, gymState.gym);
        let response = await axiosInstance.put(`/api/brands/${brandId}/gyms/${updatedGym.gymId}`, updatedGym);
        let result: Gym = response.data;
        dispatch(updateGymState(result));
 
        setTextSuccess(t("action.saveSuccess"));
        
        setSuccess(true);
        setIsSaving(false);
    }

    const activateGym = async (gymId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/activate`);
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateGym = async (gymId: string) => {
        let response = await axiosInstance.post(`/api/brands/${brandId}/gyms/${gymId}/deactivate`);
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteGym = async (gymId: string) => {
        await axiosInstance.delete(`/api/brands/${brandId}/gyms/${gymId}`);

        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/${i18n.resolvedLanguage}/brands/${brandId}/gyms`);

        }, 2000);
    }

    function onCancel() {
        setIsEditMode(false);
        formContext.reset(gymState.gym);

        if (gymId == "new") {
            router.push(`/${i18n.resolvedLanguage}/brands/${brandId}/gyms`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        setIsActivating(true);
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
            setIsDeleting(true);
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
            brandId: gym.brandId,
            gymId: gym.gymId,
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

                {isLoading &&
                    <div className="flex-fill w-100 h-100">
                        <Loader />
                    </div>
                }

                {!isLoading &&
                    <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                        <div className="w-100 h-100">
                            <FormProvider {...formContext} >
                                <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gymState.gym.gymId == "" ? true : gymState.gym.isActive}
                                         isEditDisable={isEditMode}  isDeleteDisable={(gymState.gym.id == null ? true : false)} isActivationDisabled={(gymState.gym.gymId == "" ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                    <GymInfo gym={gymState.gym} isEditMode={isEditMode} />
                                    <hr className="mt-1 mb-1" />
                                    <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="gym_info_form" />
                                </Form>

                                <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                                <ModalConfirmation title={t("gym.deleteConfirmation.title", {name: gymState.gym.name })} text={t("gym.deleteConfirmation.text")}
                                    yesText={t("gym.deleteConfirmation.yes")} noText={t("gym.deleteConfirmation.no")}
                                    actionText={t("gym.deleteConfirmation.action")}
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
