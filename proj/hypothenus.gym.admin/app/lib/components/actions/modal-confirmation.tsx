"use client"

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ModalConfirmation({ title, text, yesText, noText, actionText, show, isAction, handleResult }:
    {
        title: string,
        text: string,
        yesText: string,
        noText: string,
        actionText: string;
        show: boolean,
        isAction: boolean;
        handleResult: (value: boolean) => void
    }) {

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered={true}
            animation={true}
        >
            <Modal.Header closeButton={false}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header >
            <Modal.Body>
                {text}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-secondary" disabled={isAction} onClick={() => handleResult(false)}>{noText}</Button>
                <Button className="btn btn-primary" disabled={isAction} onClick={() => handleResult(true)}>
                    {isAction &&
                        <div className="spinner-border spinner-border-sm me-2"></div>
                    }

                    {isAction ? actionText : yesText}</Button>
            </Modal.Footer>
        </Modal>
    );
}
