"use client"

import ErrorBoundary from "@/app/lib/components/errors/error-boundary";
import GymInfo from "@/app/lib/components/gym/gym-info";
import Loader from "@/app/lib/components/navigation/loader";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Gym, newGym, GymSchema } from "@/src/lib/entities/gym";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Form from "react-bootstrap/Form";
import { SubmitHandler, useForm } from "react-hook-form";
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import ToastSuccess from "@/app/lib/components/notifications/toast-success";
import ModalConfirmation from "@/app/lib/components/actions/modal-confirmation";
import FormActionBar from "@/app/lib/components/actions/form-action-bar";
import FormActionButtons from "@/app/lib/components/actions/form-action-buttons";

export default function GymForm({ gymId }: { gymId: string }) {
    const router = useRouter()

    const [gym, setGym] = useState<Gym>(newGym());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<Gym>({
        defaultValues: gym,
        resolver: zodResolver(GymSchema),
    });

    const toggleSuccess = () => setSuccess(false);

    useEffect(() => {
        if (isLoading && gymId !== "new") {
            fetchGym(gymId);
        } else {
            setIsLoading(false);
            setIsEditMode(true);
        }
    }, [gym]);

    const fetchGym = async (gymId: string) => {
        let response = await axiosInstance.get("/api/gyms/" + gymId);
        let gym: Gym = response.data;
        setGym(gym);

        setIsLoading(false);
    }
    
    const onSubmit: SubmitHandler<Gym> = (formData: z.infer<typeof GymSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (gym.id == "") {
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
            setError("gymId", { type: "manual", message: "Gym code already exists, must be unique" });
            setIsEditMode(true);
        } else {
            setGym(result);
            reset(result);
        }
        setTextSuccess("Saving successfull !");
        setSuccess(true);
        setIsSaving(false);
    }

    const saveGym = async (formData: z.infer<typeof GymSchema>) => {
        let updatedGym: Gym = mapForm(formData, gym);
        let response = await axiosInstance.put("/api/gyms/" + updatedGym.gymId, updatedGym);
        let result: Gym = response.data;

        setGym(result);
        reset(result);

        setTextSuccess("Saving successfull !");
        setSuccess(true);
        setIsSaving(false);
    }

    const activateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/activate");
        let gym: Gym = response.data;
        setGym(gym);
        setIsActivating(false);
        setTextSuccess("Activation successfull !");
        setSuccess(true);
    }

    const deactivateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/deactivate");
        let gym: Gym = response.data;
        setGym(gym);
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
            router.push("/gyms");

        }, 2000);
    }

    function onCancel() {
        setIsEditMode(false);
        reset(gym);
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        setIsActivating(true);
        if (e.currentTarget.checked) {
            activateGym(gym.gymId);
        } else {
            deactivateGym(gym.gymId);
        }
    }

    function onEdit(e: MouseEvent<HTMLAnchorElement>) {
        if (gym.id !== "") {
            setIsEditMode(isEditMode ? false : true);
            reset(gym);
        }
    }

    function onDelete(confirmation: boolean) {
        if (confirmation) {
            setIsDeleting(true);
            deleteGym(gym.gymId);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLAnchorElement>) {
        if (gym.id !== "") {
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
            contacts: [],
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
                    <h2 className="text-secondary pt-4 ps-2">{gym.name}</h2>
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gym.gymId == "" ? true : gym.active}
                                    isActivationDisabled={(gym.gymId == "" ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <GymInfo gym={gym} register={register} errors={errors} isEditMode={isEditMode}/>
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="gym_info_form" />
                            </Form>
                          
                            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
                            <ModalConfirmation title={gym.name} text={"Are you sure you want to delete this gym ?"} yesText="Delete" noText="Cancel" actionText="Deleting..." isAction={isDeleting} show={showDeleteConfirmation} handleResult={onDelete} />
                        </div>
                    </div>
                }
            </div>
        </ErrorBoundary>
    );
}
