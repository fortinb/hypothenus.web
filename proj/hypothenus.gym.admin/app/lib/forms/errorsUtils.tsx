import { FieldErrors, FieldValues } from "react-hook-form";

export function getParentErrorField(errors: FieldErrors<FieldValues> , fieldPath?: string): any {
    if (!fieldPath) {
        return errors;
    }

    if (errors) {
        // Expected example : fieldPath = person.contacts.0

        let errorFormField: any = errors;
        const fieldParts = fieldPath.split(".");
        fieldParts?.forEach(p => {
            if (errorFormField) {
                errorFormField = errorFormField[p];
             }
        });

        return errorFormField; 
    }

    return errors;
}