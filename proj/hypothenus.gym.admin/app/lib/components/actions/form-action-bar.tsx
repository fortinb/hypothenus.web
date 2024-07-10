"use client"

import Link from "next/link";
import { ChangeEvent, MouseEvent } from 'react';
import Form from 'react-bootstrap/Form';

export default function FormActionBar({ onEdit, onDelete, onActivation, isActivationChecked, isActivationDisabled, isActivating }:
    {
        onEdit: (e: MouseEvent<HTMLAnchorElement>) => void,
        onDelete: (e: MouseEvent<HTMLAnchorElement>) => void,
        onActivation: (e: ChangeEvent<HTMLInputElement>) => void,
        isActivationChecked: boolean,
        isActivationDisabled: boolean,
        isActivating: boolean
    }) {

    return (
        <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-start align-items-center">
                <div>
                    <Link className="link-element ps-1" href="#" onClick={onEdit} ><i className="icon icon-primary bi bi-pencil h3 mb-1"></i></Link>
                </div>
                <div>
                    <Link className="link-element ms-4" href="#" onClick={onDelete} ><i className="icon icon-primary bi bi-trash h3 mb-1"></i></Link>
                </div>
            </div>
            <div className="align-items-center">
                <div className="form-check form-switch pe-2">
                    <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch"
                        id="flexSwitchCheckChecked" onChange={onActivation} disabled={isActivationDisabled || isActivating} checked={isActivationChecked} />

                    <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">
                        {isActivating &&
                            <div className="spinner-border spinner-border-sm me-2"></div>
                        }
                        Activated</label>
                </div>
            </div>
        </div>
    );
}
