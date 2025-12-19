"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { getParentErrorField } from "@/app/lib/forms/errorsUtils";
import { PhoneNumber, PhoneNumberTypeEnum } from "@/src/lib/entities/phoneNumber";
import Form from "react-bootstrap/Form";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

export default function PhoneNumberInfo({ index, id, defaultType, formStatefield, parent }:
    {
        index: number,
        id: string,
        defaultType: PhoneNumberTypeEnum,
        formStatefield: string,
        parent?: string
    }) {
    const { t } = useTranslation("entity");
    const { register, formState: { errors } } = useFormContext();

    function getError(index: number): Merge<FieldError, FieldErrorsImpl<PhoneNumber>> {
        const parentErrorField: any = getParentErrorField(errors, parent);
        return (parentErrorField?.phoneNumbers as Merge<FieldError, FieldErrorsImpl<PhoneNumber>>[])?.[index];
    }

    return (
        <Form.Group>
            <Form.Control type="hidden" id={`phone_input_type_${id}_${index}`} value={defaultType} {...register(`${formStatefield}.type`)} />
            <Form.Label className="text-primary" htmlFor={`phone_input_number_${id}_${index}`} >
                
                {defaultType == PhoneNumberTypeEnum.Home &&
                    <span>{t("phoneNumber.home")}</span>
                }

                {defaultType == PhoneNumberTypeEnum.Business &&
                    <span>{t("phoneNumber.business")}</span>
                }

                {defaultType == PhoneNumberTypeEnum.Mobile &&
                    <span>{t("phoneNumber.mobile")}</span>
                }

            </Form.Label>
            <Form.Control type="input" id={`phone_input_number_${id}_${index}`} placeholder="999 999-9999"  {...register(`${formStatefield}.number`)}
                className={getError(index) ? "input-invalid" : ""} />
            {getError(index)?.number && <Form.Text className="text-invalid">{t(getError(index)?.number?.message ?? "")}</Form.Text>}
        </Form.Group>
    );
}
