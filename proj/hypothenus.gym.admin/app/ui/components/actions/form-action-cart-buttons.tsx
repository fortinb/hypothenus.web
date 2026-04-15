"use client"

import { useTranslations } from "next-intl";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { MouseEvent } from "react";

export default function FormActionCartButtons({ onCheckout }:
    {
        onCheckout: (e: MouseEvent<HTMLButtonElement>) => void,
    }) {
    const t = useTranslations("action");

    return (
        <div className="d-flex flex-row justify-content-end" >
            <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_action_submit_tooltip">{t("form.buttons.checkout")}</Tooltip>}>
                <Button aria-label={t("form.buttons.submit")} className="btn btn-icon btn-sm" onClick={onCheckout}><i className="icon bi bi bi-bag-check h5"></i></Button>
            </OverlayTrigger>
        </div>
    );
}