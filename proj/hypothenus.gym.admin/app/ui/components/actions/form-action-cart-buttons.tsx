"use client"

import { useTranslations } from "next-intl";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { MouseEvent } from "react";

export default function FormActionCartButtons({ onCheckout, isSubmitting }:
    {
        onCheckout: (e: MouseEvent<HTMLButtonElement>) => void,
        isSubmitting: boolean;
    }) {
    const t = useTranslations("cart");

    return (
        <div className="d-flex flex-row justify-content-end" >
            <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="action_checkout_tooltip">{t("buttons.checkout.tooltip")}</Tooltip>}>
                 <Button aria-label={t("buttons.checkout.label")} className="btn btn-icon btn-sm" onClick={onCheckout}>
                    
                    {isSubmitting &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {!isSubmitting &&
                        <i className="icon icon-light bi bi-bag-check me-2 h7"></i>
                    }

                    {isSubmitting ? t("buttons.checkout.submitting") :  t("buttons.checkout.label")}
                </Button>
            </OverlayTrigger>
        </div>
    );
}