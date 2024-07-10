"use client"

import { Gym, GymSchema } from '@/src/lib/entities/gym';
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from '@/src/lib/entities/messages';
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import axiosInstance from '../../http/axiosInterceptorClient';
import FormActionBar from '../actions/form-action-bar';
import FormActionButtons from '../actions/form-action-buttons';
import ModalConfirmation from '../actions/modal-confirmation';
import ToastSuccess from '../notifications/toast-success';
import AddressInfo from './address-info';
import PhoneInfo from './phone-info';
import { useRouter } from 'next/navigation';

export default function GymInfo({ gym, setGym }: { gym: Gym, setGym: Dispatch<SetStateAction<Gym>> }) {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<Gym>({
        defaultValues: gym,
        resolver: zodResolver(GymSchema),
    });

    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggleSuccess = () => setSuccess(false);
   
    useEffect(() => {
        if (!isEditMode && gym.id == "") {
            setIsEditMode(true);
        }

    }, []);

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

        setTimeout(function()
        {
            setShowDeleteConfirmation(false);
            router.push("/gyms");

        }, 2000);
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
        <div className="w-100 h-100">
            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="gym_info_form" onSubmit={handleSubmit(onSubmit)}>
                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={gym.gymId == "" ? true : gym.active}  
                                isActivationDisabled={(gym.gymId == "" ? true : false)} isActivating={isActivating}/>
                <hr className="mt-1" />
                <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="gym_info_form" disabled={!isEditMode} >
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-6 m-2 pe-3">
                            <Form.Group>
                                <Form.Label className="text-primary" htmlFor="gym_info_input_code">Code</Form.Label>
                                <Form.Control type="input" id="gym_info_input_code" placeholder="Gym unique code" {...register("gymId")}
                                    className={errors.gymId ? "input-invalid" : ""}
                                    disabled={(gym.gymId !== "" ? true : false)} />
                                {errors.gymId && <Form.Text className="text-invalid">{errors.gymId.message}</Form.Text>}
                            </Form.Group>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-6 p-2">
                            <Form.Group>
                                <Form.Label className="text-primary" htmlFor="gym_info_input_name">Name</Form.Label>
                                <Form.Control type="input" id="gym_info_input_name" placeholder=""  {...register("name")}
                                    className={errors.name ? "input-invalid" : ""} />
                                {errors.name && <Form.Text className="text-invalid">{errors.name.message}</Form.Text>}
                            </Form.Group>
                        </div>
                        <div className="col-6 p-2">
                            <Form.Group>
                                <Form.Label className="text-primary" htmlFor="gym_info_input_email">Email address</Form.Label>
                                <Form.Control type="input" id="gym_info_input_email" placeholder="example@email.ca" {...register("email")}
                                    className={errors.email ? "input-invalid" : ""} />
                                {errors.email && <Form.Text className="text-invalid">{errors.email.message}</Form.Text>}
                            </Form.Group>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-12">
                            <AddressInfo register={register} errors={errors} />
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-12">
                            <PhoneInfo register={register} errors={errors} />
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-12 p-2">
                            <Form.Group>
                                <Form.Label className="text-primary" htmlFor="gym_info_input_note">Notes</Form.Label>
                                <Form.Control as="textarea" id="gym_info_input_note" rows={4} {...register("note")} />
                            </Form.Group>
                        </div>
                    </div>
                </fieldset>
                <hr className="mt-1 mb-1" />
                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} href="/gyms" formId="gym_info_form"/>
            </Form>
            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
            <ModalConfirmation title={gym.name} text={"Are you sure you want to delete this gym ?"} yesText="Delete" noText="Cancel" actionText="Deleting..." isAction={isDeleting} show={showDeleteConfirmation}  handleResult={onDelete} />
        </div>
    );
}