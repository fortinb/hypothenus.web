"use client"

import { Contact, formatName, newContact } from "@/src/lib/entities/contact";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import { useFieldArray, useFormContext } from "react-hook-form";
import ModalConfirmation from "../actions/modal-confirmation";
import ContactInfo from "../contact/contact-info";
import Button from "react-bootstrap/Button";

export default function GymContactInfo({ isEditMode }: { isEditMode: boolean }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [contactIndexToDelete, setContactIndexToDelete] = useState<number>(-1);

    const formContacts = useFieldArray({
        name: "contacts",
    });

    function onDelete(confirmation: boolean) {
        if (confirmation ?? contactIndexToDelete >= 0) {
            setIsDeleting(true);
            deleteContact(contactIndexToDelete);
        } else {
            setShowDeleteConfirmation(false);
        }

        setContactIndexToDelete(-1);
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>, index: number) {
        setContactIndexToDelete(index);
        setShowDeleteConfirmation(true);
    }

    const deleteContact = (index: number) => {
        setShowDeleteConfirmation(false);
        formContacts.remove(index);
        setIsDeleting(false);
    }

    const onAddContact = (e: MouseEvent<HTMLButtonElement>) => {
        formContacts.prepend(newContact());
    }

    return (
        <div>
            <Row className="m-0 pe-2">
                <div className="d-flex flex-row justify-content-end mb-1 me-3">
                    <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="form_action_add_contact_tooltip">Add new contact</Tooltip>}>
                        <Button className="btn btn-icon btn-sm" disabled={!isEditMode} onClick={onAddContact}><i className="icon bi bi-person-plus h5"></i></Button>
                    </OverlayTrigger>
                </div>
            </Row>
            <Row className="m-0 pb-2">
                <Accordion >
                    {formContacts.fields?.map((contact: Record<string, any>, index: number) => {
                        return <Accordion.Item key={index} eventKey={index.toString()} className="pt-2">
                            <Accordion.Header className="accordion-header-light">{formatName(contact as Contact)}</Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Card>
                                    <Card.Body className="">
                                        <Card.Title >
                                            <div className="d-flex flex-row justify-content-end">
                                                <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id={"form_action_delete_contact_tooltip_" + index}>Delete</Tooltip>}>
                                                    <Button className="btn btn-icon btn-sm" disabled={!isEditMode} onClick={(e) => onDeleteConfirmation(e, index)}><i className="icon bi bi-trash h5"></i></Button>
                                                </OverlayTrigger>
                                            </div>
                                        </Card.Title>
                                        <ContactInfo key={contact.id} index={index} id="gym_contact" formStatefield={"contacts." + index} />
                                    </Card.Body>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    })}

                </Accordion>

                <ModalConfirmation title={""} text={"Are you sure you want to delete this contact ?"}
                    yesText="Delete" noText="Cancel"
                    actionText="Deleting..."
                    isAction={isDeleting}
                    show={showDeleteConfirmation} handleResult={onDelete} />
            </Row>
        </div>
    );

    /*
     <Link className={"link-element ms-4" + (!isEditMode ? " link-disabled" : "")} href="#"
                            onClick={onAddContact}>
                            <i className="icon icon-secondary bi bi-person-plus h3 mb-1"></i></Link>

                             <Link className={"link-element ms-4" + (!isEditMode ? " link-disabled" : "")} href="#"
                                                        onClick={(e) => onDeleteConfirmation(e, index)}>
                                                        <i className="icon icon-secondary bi bi-trash h3 mb-1"></i></Link>
    */
}