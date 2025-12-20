"use client"

import { useTranslations } from "next-intl";
import { getParentErrorField } from "@/app/lib/forms/errorsUtils";
import { LanguageEnum } from "@/src/lib/entities/language";
import { LocalizedString } from "@/src/lib/entities/localizedString";
import Form from "react-bootstrap/Form";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

export default function LocalizedStringInfo({ index, id, language, formStatefield, parent, nbRows }:
    {
        index: number,
        id: string,
        language: LanguageEnum,
        formStatefield: string,
        parent?: string,
        nbRows: number
    }) {
    const t = useTranslations("entity");
    const { register, formState: { errors } } = useFormContext();

    function getError(index: number): Merge<FieldError, FieldErrorsImpl<LocalizedString>> {
        const parentErrorField: any = getParentErrorField(errors, parent);
        return (parentErrorField as Merge<FieldError, FieldErrorsImpl<LocalizedString>>[])?.[index];
    }

    return (
        <Form.Group>
            <Form.Control type="hidden" id={`localized_string_input_language_${id}_${index}`} value={language} {...register(`${formStatefield}.language`)} />
            <Form.Control as="textarea" type="input" rows={nbRows} id={`localized_string_input_text_${id}_${index}`}  {...register(`${formStatefield}.text`)}
                className={getError(index)?.text ? "input-invalid" : ""} />
            {getError(index)?.text && <Form.Text className="text-invalid">{t(getError(index)?.text?.message ?? "")}</Form.Text>}
        </Form.Group>
    );
}
