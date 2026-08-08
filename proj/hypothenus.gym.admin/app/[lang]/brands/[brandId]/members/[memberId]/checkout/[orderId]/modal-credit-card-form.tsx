"use client"

import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { ActionResult } from "@/app/lib/http/result";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import { CreditCardInfo } from "@/app/ui/components/finance/credit-card-info";
import { FinancialInstrumentTypeEnum } from "@/src/lib/entities/enum/financial-instrument-type-enum";
import { FinancialInstrument, FinancialInstrumentCreditCardSchema, formatExpirationDate, newFinancialInstrument } from "@/src/lib/entities/finance/financial-instrument";
import { Member } from "@/src/lib/entities/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createFinancialInstrumentAction } from "./actions";

export default function ModalCreditCardForm({ lang, show, member, orderId, handleResult }:
    {
        lang: string,
        show: boolean,
        member: Member;
        orderId: string;
        handleResult: (financialInstrument: FinancialInstrument | null) => void
    }) {

    const t = useTranslations("entity");
    const [initialFinancialInstrument, setInitialFinancialInstrument] = useState<FinancialInstrument>(newFinancialInstrument(member.brandUuid, member.uuid, FinancialInstrumentTypeEnum.creditCard));
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const { isSaving, createEntity
    } = useCrudActions<FinancialInstrument>({
        actions: {
            create: createFinancialInstrumentAction,
            save: function (...args: any[]): Promise<ActionResult<FinancialInstrument>> {
                throw new Error("Function not implemented.");
            },
            activate: function (...args: any[]): Promise<ActionResult<FinancialInstrument>> {
                throw new Error("Function not implemented.");
            },
            deactivate: function (...args: any[]): Promise<ActionResult<FinancialInstrument>> {
                throw new Error("Function not implemented.");
            },
            delete: function (...args: any[]): Promise<ActionResult<void>> {
                throw new Error("Function not implemented.");
            }
        }
    });

    const formContext = useForm<z.infer<typeof FinancialInstrumentCreditCardSchema>>({
        defaultValues: mapEntityToForm(initialFinancialInstrument),
        resolver: zodResolver(FinancialInstrumentCreditCardSchema)
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useFormDebug(formContext);

    const onSubmit: SubmitHandler<z.infer<typeof FinancialInstrumentCreditCardSchema>> = (formData: z.infer<typeof FinancialInstrumentCreditCardSchema>) => {
        setIsEditMode(false);

        const updatedFinancialInstrument = mapFormToEntity(formData, initialFinancialInstrument);
       
        createFinancialInstrument(updatedFinancialInstrument);
     }

    const createFinancialInstrument = (financialInstrument: FinancialInstrument) => {
        createEntity(
            financialInstrument,
            `/${lang}/brands/${member.brandUuid}/members/${member.uuid}/checkout/${orderId}`,
             // Before save
            async (_financialInstrument) => {
            },
            // Success
            (financialInstrument) => {
                showResultToast(true, t("action.saveSuccess"));
                setInitialFinancialInstrument(newFinancialInstrument(member.brandUuid, member.uuid, FinancialInstrumentTypeEnum.creditCard));
                formContext.reset(mapEntityToForm(initialFinancialInstrument));
                setIsEditMode(true);

                handleResult(financialInstrument);
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    function mapEntityToForm(financialInstrument?: FinancialInstrument): z.infer<typeof FinancialInstrumentCreditCardSchema> {
        return {
            cardNumber: financialInstrument?.creditCard?.cardNumber ?? "",
            cardHolderName: financialInstrument?.creditCard?.cardHolderName ?? "",
            expirationDate: formatExpirationDate(financialInstrument?.creditCard?.expirationDate ?? ""),
            cvd: financialInstrument?.creditCard?.cvd ?? "",
            zipCode: financialInstrument?.creditCard?.zipCode ?? ""
        };
    }

    function mapFormToEntity(formData: z.infer<typeof FinancialInstrumentCreditCardSchema>, financialInstrument: FinancialInstrument): FinancialInstrument {
        return {
            ...financialInstrument,
            creditCard: {
                cardNumber: formData.cardNumber,
                cardHolderName: formData.cardHolderName,
                expirationDate: formData.expirationDate,
                cvd: formData.cvd,
                zipCode: formData.zipCode
            }
        };
    };

    function onCancel() {
        setIsEditMode(true);
        handleResult(null);
    }

    return (
        <Modal
            className="modal"
            show={show}
            backdrop="static"
            keyboard={false}
            centered={true}
            animation={true}
            onHide={() => { handleResult(null) }}
        >
            <Modal.Header className="modal-content-light" closeButton={true}>
                <Modal.Title className="w-100">
                    <div className="d-flex flex-row justify-content-center align-items-center">
                         <i className="icon icon-secondary bi bi-credit-card me-2"></i>
                        <span className="ms-1 text-tertiary">{t("financialInstrument.creditCard.title")}</span><br />
                    </div>
                </Modal.Title>
            </Modal.Header >
            <Modal.Body className="modal-content-light">
                <div className="d-flex flex-column justify-content-center">
                    <FormProvider {...formContext} >
                        <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100" id="creditcard_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                            <CreditCardInfo creditCard={initialFinancialInstrument?.creditCard} isEditMode={isEditMode} />
                            <hr className="mt-1 mb-1" />
                            <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="creditcard_info_form" />
                        </Form>
                    </FormProvider>
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-content-light"></Modal.Footer>
        </Modal>
    );
}
