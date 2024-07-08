"use client"

import { Gym, GymSchema } from '@/src/lib/entities/gym';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import AddressInfo from './address-info';
import PhoneInfo from './phone-info';
import axiosInstance from '../../http/axiosInterceptorClient';
import Link from 'next/link';

export default function GymInfo({ gym, setGym }: { gym: Gym, setGym: Dispatch<SetStateAction<Gym>> }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Gym>({
        defaultValues: gym,
        resolver: zodResolver(GymSchema),
    });
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    useEffect(() => {
        if (gym.gymId == "") {
            setIsEditMode(true);
        }

        reset(gym);
    }, [gym, isEditMode]);


    const onSubmit: SubmitHandler<Gym> = (formData: z.infer<typeof GymSchema>) => {
        console.log(formData);
    }

    const onDebug = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        console.log(errors);
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
        setIsEditMode(isEditMode ? false : true);
    }

    return (


        <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="d-flex flex-column overflow-auto h-100 w-100" disabled={!isEditMode} >
                
                    <div className="d-flex flex-row justify-content-start">
                        <div className="col-6 m-2 pe-3">
                            <Form.Group>
                                <Form.Label className="text-primary" htmlFor="gym_info_input_code">Code</Form.Label>
                                <Form.Control type="input" id="gym_info_input_code" placeholder="Gym unique code" {...register("gymId")}
                                    className={errors.gymId ? "input-invalid" : ""} />
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
                                <Form.Control as="textarea" id="gym_info_input_note" rows={5} {...register("note")} />
                            </Form.Group>
                        </div>
                    </div>
                
            </fieldset>
            <div className="d-flex flex-row justify-content-end">
                <div className="col-2 p-2">
                    <Button className="btn btn-primary ms-2" type="submit" variant="primary">Save</Button>
                </div>
                <div className="col-2 p-2">
                    <Button className="btn btn-primary ms-2" onClick={onDebug} variant="primary">Debug</Button>
                </div>
            </div>

        </Form>


    );
}
/*
      <div className="d-flex flex-row justify-content-between align-items-center">

                <div className="m-3">
                    <Link className="link-element pb-1" href="#" onClick={onEdit}><i className="icon icon-secondarybi bi-pencil h3 mb-1"></i></Link>
                </div>
                <div className="align-items-center">
                    <div className="form-check form-switch pe-2">
                        <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch" name="includeDeactivate"
                            id="flexSwitchCheckChecked" onChange={onActivation} disabled={(gym.gymId == "" ? true : false) || !isEditMode} checked={gym.gymId == "" ? true : gym.active} />
                        <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">Activated</label>
                    </div>
                </div>
            </div>


*/