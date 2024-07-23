"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { ChangeEvent, MouseEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function FormActionBar({ onEdit, onDelete, onActivation, isActivationChecked, isActivationDisabled, isActivating }:
    {
        onEdit: (e: MouseEvent<HTMLButtonElement>) => void,
        onDelete: (e: MouseEvent<HTMLButtonElement>) => void,
        onActivation: (e: ChangeEvent<HTMLInputElement>) => void,
        isActivationChecked: boolean,
        isActivationDisabled: boolean,
        isActivating: boolean
    }) {

    const { t } = useTranslation("action");

    return (
        <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-start">
                <div className="p-1">
                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_action_edit_tooltip">{t("form.bar.edit")}</Tooltip>}>
                        <Button className="btn btn-icon btn-sm" onClick={onEdit}><i className="icon bi bi-pencil h5"></i></Button>
                    </OverlayTrigger>
                </div>
            </div>
            <div className="d-flex flex-row justify-content-end">
                <div className="pe-4">
                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_action_delete_tooltip">{t("form.bar.delete")}</Tooltip>}>
                        <Button className="btn btn-icon btn-sm" onClick={onDelete}><i className="icon bi bi-trash h5"></i></Button>
                    </OverlayTrigger>
                </div>
                <div className="form-check form-switch pe-2">
                    <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch"
                        id="flexSwitchCheckChecked" onChange={onActivation} disabled={isActivationDisabled || isActivating} checked={isActivationChecked} />

                    <Form.Label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">

                        {isActivating &&
                            <div className="spinner-border spinner-border-sm me-2"></div>
                        }
                        
                        {t("form.bar.activate")}</Form.Label>
                </div>
            </div>
        </div>
    );
}
