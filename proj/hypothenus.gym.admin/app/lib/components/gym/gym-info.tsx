"use client"

import { Gym, GymSchema } from '@/src/lib/entities/gym';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import AddressInfo from './address-info';
import PhoneInfo from './phone-info';
import axiosInstance from '../../http/axiosInterceptorClient';
import Link from 'next/link';
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from '@/src/lib/entities/messages';

export default function GymInfo({ gym, setGym }: { gym: Gym, setGym: Dispatch<SetStateAction<Gym>> }) {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<Gym>({
        defaultValues: gym,
        resolver: zodResolver(GymSchema),
    });

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [savingSuccessfull, setSavingSuccessfull] = useState(false);
    const toggleSavingSuccessfull = () => setSavingSuccessfull(false);

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
        setSavingSuccessfull(true)
        setIsSaving(false);
    }

    const saveGym = async (formData: z.infer<typeof GymSchema>) => {
        let updatedGym: Gym = mapForm(formData, gym);
        let response = await axiosInstance.put("/api/gyms/" + updatedGym.gymId, updatedGym);
        let result: Gym = response.data;

        setGym(result);
        reset(result);

        setSavingSuccessfull(true)
        setIsSaving(false);
    }

    const activateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/activate");
        let gym: Gym = response.data;
        setGym(gym);
    }

    const deactivateGym = async (gymId: string) => {
        let response = await axiosInstance.post("/api/gyms/" + gymId + "/deactivate");
        let gym: Gym = response.data;
        setGym(gym);
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
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
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <div className="d-flex flex-row justify-content-start align-items-center">
                        <div>
                            <Link className="link-element ps-1" href="#" onClick={onEdit} ><i className="icon icon-secondarybi bi-pencil h3 mb-1"></i></Link>
                        </div>
                        <div>
                            <Link className="link-element ms-4" href="#" onClick={onEdit} ><i className="icon icon-secondarybi bi-trash h3 mb-1"></i></Link>
                        </div>
                    </div>
                    <div className="align-items-center">
                        <div className="form-check form-switch pe-2">
                            <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch" name="includeDeactivate"
                                id="flexSwitchCheckChecked" onChange={onActivation} disabled={(gym.gymId == "" ? true : false) || !isEditMode} checked={gym.gymId == "" ? true : gym.active} />
                            <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">Activated</label>
                        </div>
                    </div>
                </div>
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
                <div className="d-flex flex-row justify-content-between" >
                    <div className="p-2">
                        <Link className="btn btn-secondary ms-2" href="/gyms"><i className="icon icon-secondarybi bi-x-lg me-2"></i>Cancel</Link>
                    </div>
                   
                    <fieldset className="p-2" disabled={!isEditMode} form="gym_info_form">
                        <Button className="btn btn-primary pt-2 pb-2 me-3" type="submit" variant="primary">
                            {isSaving &&
                                <div className="spinner-border spinner-border-sm me-2"></div>
                            }

                            {!isSaving &&
                                <i className="icon bi bi-floppy me-2 h7"></i>
                            }

                            {isSaving ? "Saving" : "Save"}
                        </Button>
                    </fieldset>
                </div>
            </Form>
            <Toast className="toast-success" show={savingSuccessfull} onClose={toggleSavingSuccessfull} autohide={true} delay={3000} animation={true} role="alert">
                        <Toast.Body className="d-flex flex-row justify-content-center">
                            Saving successfull !
                        </Toast.Body>
                    </Toast>
        </div>

    );
}