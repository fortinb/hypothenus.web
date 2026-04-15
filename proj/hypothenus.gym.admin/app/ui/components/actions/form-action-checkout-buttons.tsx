"use client"

import { useTranslations } from "next-intl";
import Button from "react-bootstrap/Button";

export default function FormActionCheckoutButtons({ isSubmitting, isEditMode, formId }: 
    { 
        isSubmitting: boolean, 
        isEditMode: boolean, 
        formId: string
    }) {
    const t = useTranslations("action");
    
    return (
        <div className="d-flex flex-row justify-content-end" >

            <fieldset className="p-2" disabled={!isEditMode} form={formId}>
                <Button aria-label={t("form.buttons.submit")} className="btn btn-primary pt-2 pb-2 me-3" form={formId} type="submit">
                    
                    {isSubmitting &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {!isSubmitting &&
                        <i className="icon icon-light bi bi-bag-check me-2 h7"></i>
                    }

                    {isSubmitting ? t("form.buttons.submitting") :  t("form.buttons.submit")}
                </Button>
            </fieldset>
        </div>
    );
}