"use client"

import { useTranslations } from "next-intl";
import Toast from "react-bootstrap/Toast";

export default function ToastResult({ show, result, text, errorTextCode, toggleShow }: { show: boolean, result: boolean, text: string, errorTextCode: string, toggleShow: (e?: any) => any }) {
    const t = useTranslations("errors");

    return (
        <Toast className= {(result ? "toast-success" : "toast-error")} onClose={toggleShow} show={show} autohide={true} delay={3000} animation={true} role="alert">
            <Toast.Body className="d-flex flex-row justify-content-center">
                {text} {(errorTextCode ? ` - ${t(errorTextCode)}` : "")}
            </Toast.Body>
        </Toast>
    );
}
