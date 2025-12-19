"use client"

import { useTranslation } from "@/app/i18n/i18n";
import Button from "react-bootstrap/Button";

export default function FormActionButtons({ isSaving, isEditMode, formId, onCancel }: { isSaving: boolean, isEditMode: boolean, formId: string, onCancel: () => void }) {
    const { t } = useTranslation("action");
    
    return (
        <div className="d-flex flex-row justify-content-between" >
            <div className="p-2">
                <Button className="btn btn-secondary ms-2" disabled={!isEditMode} onClick={onCancel}><i className="icon icon-light bi bi-x-lg me-2"></i>{t("form.buttons.cancel")}</Button>
            </div>
            <fieldset className="p-2" disabled={!isEditMode} form={formId}>
                <Button className="btn btn-primary pt-2 pb-2 me-3" form={formId} type="submit">
                    
                    {isSaving &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {!isSaving &&
                        <i className="icon icon-light bi bi-floppy me-2 h7"></i>
                    }

                    {isSaving ? t("form.buttons.saving") :  t("form.buttons.save")}
                </Button>
            </fieldset>
        </div>
    );
}