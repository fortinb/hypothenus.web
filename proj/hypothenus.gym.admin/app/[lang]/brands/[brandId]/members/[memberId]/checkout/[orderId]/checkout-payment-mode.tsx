"use client"

import { FinancialInstrument } from "@/src/lib/entities/finance/financial-instrument";
import { Member } from "@/src/lib/entities/member";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalCreditCardForm from "./modal-credit-card-form";
import { FinancialInstrumentSelectedItem } from "@/src/lib/entities/ui/financial-instrument-selected-item";
import Select from "react-select";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import { Order, OrderSchema } from "@/src/lib/entities/sale/order";
import { Controller, useFormContext } from "react-hook-form";
import Form from "react-bootstrap/Form";
import z from "zod";

export default function CheckoutPaymentMode({ lang, member, order, initialAvailableFinancialInstrumentItems, preferredFinancialInstrumentUuid, isEditMode }:
    {
        lang: string;
        member: Member;
        order: Order;
        initialAvailableFinancialInstrumentItems: FinancialInstrumentSelectedItem[];
        preferredFinancialInstrumentUuid: string;
        isEditMode: boolean;
    }) {

    const t = useTranslations("payment");
    const router = useRouter();
    const { register, formState: { errors }, setValue } = useFormContext<z.infer<typeof OrderSchema>>();

    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [preferredFinancialInstrument, setPreferredFinancialInstrument] = useState(preferredFinancialInstrumentUuid);
    const [selectedFinancialInstrumentItems, setSelectedFinancialInstrumentItems] = useState<FinancialInstrumentSelectedItem | null>(null);
    const [availableFinancialInstrumentItems, setAvailableFinancialInstrumentItems] = useState<FinancialInstrumentSelectedItem[]>(initialAvailableFinancialInstrumentItems);

    useEffect(() => {
        setAvailableFinancialInstrumentItems(initialAvailableFinancialInstrumentItems);
    }, [initialAvailableFinancialInstrumentItems]);

    useEffect(() => {
        const preferredItem = availableFinancialInstrumentItems.find(item => item.value === preferredFinancialInstrument) ?? null;
        setSelectedFinancialInstrumentItems(preferredItem);
        setValue(`paymentDetail.financialInstrumentUuid`, preferredFinancialInstrument);
    }, [availableFinancialInstrumentItems, preferredFinancialInstrumentUuid]);

    function handleAddCreditCard(financialInstrument: FinancialInstrument | null) {
        setShowCreditCardModal(false);
        setPreferredFinancialInstrument(financialInstrument?.uuid ?? preferredFinancialInstrumentUuid);
        setValue(`paymentDetail.financialInstrumentUuid`, preferredFinancialInstrument);
        router.refresh();
    }

    function onFinancialInstrumentSelection(financialInstrumentSelectedItem: FinancialInstrumentSelectedItem) {
        setSelectedFinancialInstrumentItems(financialInstrumentSelectedItem);
    }

    return (
        <div className="d-flex flex-column justify-content-start h-50 ms-4 me-4 mt-2">
            <Container>
                <div className="d-flex flex-row justify-content-start">
                    <h4 className="text-secondary">{t("title")}</h4>
                </div>

                <Row className="gx-2">
                    <Col xs={8} >
                        <div className="d-flex flex-row justify-content-start">
                            <div className="d-flex flex-column flex-fill justify-content-start">
                                <Controller
                                    name={`paymentDetail.financialInstrumentUuid`}
                                    render={({ field }) => (
                                        <div>
                                            <Select
                                                {...field}
                                                instanceId="payment_method"
                                                inputId="payment_method"
                                                isMulti={false}
                                                options={availableFinancialInstrumentItems}
                                                onChange={(selected) => {
                                                    field.onChange(selected?.financialInstrument.uuid ?? "");
                                                    onFinancialInstrumentSelection(selected as FinancialInstrumentSelectedItem);
                                                }}
                                                value={selectedFinancialInstrumentItems}
                                                hideSelectedOptions={true}
                                                closeMenuOnSelect={true}
                                                placeholder={t("financialInstrument.filter.placeholder")}
                                                noOptionsMessage={() => t("financialInstrument.filter.noOptions")}
                                                isClearable={true}
                                                isDisabled={!isEditMode}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={4} className="d-flex flex-row justify-content-start">
                        <button className="btn btn-primary" disabled={!isEditMode} onClick={() => setShowCreditCardModal(true)}>
                            <i className="icon icon-light bi bi-credit-card me-2"></i>{t("buttons.addCreditCard")}</button>
                    </Col>
                </Row>
                <Row className="gx-2">
                    <Col xs={12} className="d-flex flex-row justify-content-start">
                        {errors?.paymentDetail?.financialInstrumentUuid && <Form.Text className="text-invalid">{t(errors.paymentDetail.financialInstrumentUuid.message as string)}</Form.Text>}
                    </Col>
                </Row>
            </Container>
            <ModalCreditCardForm lang={lang} member={member} orderId={order.uuid} show={showCreditCardModal} handleResult={handleAddCreditCard} />
        </div >
    );
}