"use client"

import Toast from "react-bootstrap/Toast";

export default function ToastSuccess({ show, text, toggleShow }: { show: boolean, text: string, toggleShow: (e?: any) => any }) {

    return (
        <Toast className="toast-success" onClose={toggleShow} show={show} autohide={true} delay={3000} animation={true} role="alert">
            <Toast.Body className="d-flex flex-row justify-content-center">
                {text}
            </Toast.Body>
        </Toast>
    );
}
