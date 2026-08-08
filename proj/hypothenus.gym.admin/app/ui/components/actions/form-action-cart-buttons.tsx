"use client"

import { useTranslations } from "next-intl";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { MouseEvent } from "react";

export default function FormActionCartButtons({ onCheckout, hasItems, isSaving, isEditMode }:
    {
        onCheckout: (e: MouseEvent<HTMLButtonElement>) => void,
        hasItems: boolean;
        isSaving: boolean;
        isEditMode: boolean;
    }) {
    const t = useTranslations("cart");

    return (
        <div className="d-flex flex-row justify-content-end" >
            <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="action_checkout_tooltip">{t("buttons.checkout.tooltip")}</Tooltip>}>
                 <Button  disabled={!isEditMode || !hasItems} aria-label={t("buttons.checkout.label")} className="btn btn-icon btn-sm" onClick={onCheckout}>
                    
                    {isSaving &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {!isSaving &&
                        <i className="icon icon-light bi bi-bag-check me-2 h7"></i>
                    }

                    {isSaving ? t("buttons.checkout.submitting") :  t("buttons.checkout.label")}
                </Button>
            </OverlayTrigger>
        </div>
    );
}