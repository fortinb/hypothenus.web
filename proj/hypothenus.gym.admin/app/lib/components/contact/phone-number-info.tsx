"use client"

import { PhoneNumber, PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Form from "react-bootstrap/Form";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

export default function PhoneNumberInfo({ index, id, defaultType, formStatefield }:
    {
        index: number,
        id: string,
        defaultType: PhoneNumberTypeEnum,
        formStatefield: string
    }) {

    const { register, formState: { errors } } = useFormContext();

    function getError(index: number): Merge<FieldError, FieldErrorsImpl<PhoneNumber>> {
        return (errors?.phoneNumbers as unknown as Merge<FieldError, FieldErrorsImpl<PhoneNumber>>[])?.[index];
    }

    return (
        <Form.Group>
            <Form.Control type="hidden" id={"phone_input_type_" + id + index} value={defaultType} {...register(formStatefield + ".type")} />
            <Form.Label className="text-primary" htmlFor={"phone_input_number_" + { id } + { index }} >
                {defaultType == PhoneNumberTypeEnum.Home &&
                    <span>Home</span>
                }

                {defaultType == PhoneNumberTypeEnum.Business &&
                    <span>Business</span>
                }

                {defaultType == PhoneNumberTypeEnum.Mobile &&
                    <span>Mobile</span>
                }
            </Form.Label>
            <Form.Control type="input" id={"phone_input_number_" + id + index} placeholder="999 999-9999"  {...register(formStatefield + ".number")}
                className={getError(index) ? "input-invalid" : ""} />
            {getError(index)?.number && <Form.Text className="text-invalid">{getError(index)?.number?.message ?? ""}</Form.Text>}
        </Form.Group>
    );
}