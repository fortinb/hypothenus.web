"use client"

import FormActionBar from "@/app/lib/components/actions/form-action-bar";
import FormActionButtons from "@/app/lib/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/lib/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/lib/components/errors/error-boundary";
import GymInfo from "@/app/lib/components/gym/gym-info";
import Loader from "@/app/lib/components/navigation/loader";
import ToastSuccess from "@/app/lib/components/notifications/toast-success";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { clearGymState } from "@/app/lib/store/slices/gym-state-slice";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import { Gym, GymSchema, newGym } from "@/src/lib/entities/gym";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

export default function GymForm({ gymId }: { gymId: string }) {
    const router = useRouter()
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

    const formContext = useForm<Gym>({
        defaultValues: gymState.gym,
        resolver: zodResolver(GymSchema),
    });

    const toggleSuccess = () => setSuccess(false);

    useEffect(() => {
        if (isLoading && gymId !== "new") {
            fetchGym(gymId);
        }

        if (isLoading && gymId == "new") {
            setIsEditMode(true);
            setIsLoading(false);
        }

        return () => {
            dispatch(clearGymState());
          };
    }, []);

    const fetchGym = async (gymId: string) => {
        let response = await axiosInstance.get("/api/gyms/" + gymId);
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));
        formContext.reset(gym);
        setIsLoading(false);
    }

    const onSubmit: SubmitHandler<Gym> = (formData: z.infer<typeof GymSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (gymState.gym.id == "") {
            createGym(formData);
        } else {
            saveGym(formData);
        }
    }

    const createGym = async (formData: z.infer<typeof GymSchema>) => {
        let response = await axiosInstance.post("/api/gyms", formData);

        let result: Gym = response.data;
        const duplicate = result.messages?.find(m => m.code == DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST)
        if (duplicate) {
            formContext.setError("gymId", { type: "manual", message: "Gym code already exists, must be unique" });
            setIsEditMode(true);
        } else {
            dispatch(updateGymState(result));
            formContext.reset(result);
        }
        setTextSuccess("Saving successfull !");
        setSuccess(true);
        setIsSaving(false);
    }

    const saveGym = async (formData: z.infer<typeof GymSchema>) => {
        let updatedGym: Gym = mapForm(formData, gymState.gym);
        let response = await axiosInstance.put("/api/gyms/" + updatedGym.gymId, updatedGym);
        let result: Gym = response.data;

        dispatch(updateGymState(result));
        formContext.reset(result);

        setTextSuccess("Saving successfull !");
        setSuccess(true);
        setIsSaving(false);
    }

    const activateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/activate");
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));
        setIsActivating(false);
        setTextSuccess("Activation successfull !");
        setSuccess(true);
    }

    const deactivateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/deactivate");
        let gym: Gym = response.data;
        dispatch(updateGymState(gym));
        setIsActivating(false);
        setTextSuccess("Deactivation successfull !");
        setSuccess(true);
    }

    const deleteGym = async (gymId: string) => {
        await axiosInstance.delete("/api/gyms/" + gymId);

        setTextSuccess("Deleting successfull !");
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push("/gyms");

        }, 2000);
    }

    function onCancel() {
        setIsEditMode(false);
        formContext.reset(gymState.gym);
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
            setIsEditMode(isEditMode ? false : true);
            formContext.reset(gymState.gym);
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
            gymId: gym.gymId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            active: gym.active,
            note: formData.note,
            contacts: formData.contacts,
            phoneNumbers: formData.phoneNumbers,
            socialMediaAccounts: [],
            messages: undefined,
            createdBy: undefined,
            modifiedBy: undefined
        };

        return updatedGym;
    }

    return (
        <ErrorBoundary>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="d-flex flex-row justify-content-center">
                    <h2 className="text-secondary pt-4 ps-2">{gymState.gym.name}</h2>
                </div>
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
                            <FormProvider {...formContext } >
                                <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gymState.gym.gymId == "" ? true : gymState.gym.active}
                                        isActivationDisabled={(gymState.gym.gymId == "" ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                    <GymInfo gym={gymState.gym} isEditMode={isEditMode} />
                                    <hr className="mt-1 mb-1" />
                                    <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="gym_info_form" />
                                </Form>

                                <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                                <ModalConfirmation title={gymState.gym.name} text={"Are you sure you want to delete this gym ?"}
                                    yesText="Delete" noText="Cancel"
                                    actionText="Deleting..."
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
