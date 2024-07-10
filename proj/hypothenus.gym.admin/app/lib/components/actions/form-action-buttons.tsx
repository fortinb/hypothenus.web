"use client"

import Link from "next/link";
import Button from 'react-bootstrap/Button';

export default function FormActionButtons({ isSaving, isEditMode, formId, href }: { isSaving: boolean, isEditMode: boolean, formId: string, href: string }) {

    return (
        <div className="d-flex flex-row justify-content-between" >
            <div className="p-2">
                <Link className="btn btn-secondary ms-2" href={href}><i className="icon icon-secondarybi bi-x-lg me-2"></i>Cancel</Link>
            </div>
            <fieldset className="p-2" disabled={!isEditMode} form={formId}>
                <Button className="btn btn-primary pt-2 pb-2 me-3" form={formId} type="submit" variant="primary">
                    {isSaving &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {!isSaving &&
                        <i className="icon bi bi-floppy me-2 h7"></i>
                    }

                    {isSaving ? "Saving" : "Save"}
                </Button>
            </fieldset>
        </div>
    );
}
