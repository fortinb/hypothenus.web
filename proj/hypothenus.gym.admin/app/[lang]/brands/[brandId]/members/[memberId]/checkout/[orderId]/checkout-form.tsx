"use client";

import { useFormDebug } from "@/app/lib/hooks/useFormDebug";
import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { ActionResult } from "@/app/lib/http/result";
import { clearCart, setCartCheckout } from "@/app/lib/store/slices/cart-state-slice";
import FormActionCheckoutButtons from "@/app/ui/components/actions/form-action-checkout-buttons";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { OrderCheckoutInfo } from "@/app/ui/components/order/order-checkout-info";
import { Member } from "@/src/lib/entities/member";
import { Order, OrderSchema } from "@/src/lib/entities/sale/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { submitOrderAction } from "./actions";
import { FinancialInstrumentSelectedItem } from "@/src/lib/entities/ui/financial-instrument-selected-item";
import CheckoutPaymentMode from "./checkout-payment-mode";
import { ShippingMethodEnum } from "@/src/lib/entities/enum/shipping-method-enum";
import { PaymentMethodEnum } from "@/src/lib/entities/enum/payment-method-enum";

export function CheckoutForm({ lang, brandId, member, preparedOrder, initialAvailableFinancialInstrumentItems, preferredFinancialInstrumentUuid }:
    {
        lang: string;
        brandId: string;
        member: Member;
        preparedOrder: Order;
        initialAvailableFinancialInstrumentItems: FinancialInstrumentSelectedItem[];
        preferredFinancialInstrumentUuid: string;
    }) {
    const t = useTranslations("checkout");
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [order, setOrder] = useState<Order>(preparedOrder);
    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const { isSubmitting, submitOrder } = useOrderActions({
        actions: {
            submit: submitOrderAction,
            create: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            },
            patch: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            }
        }
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    const formContext = useForm<z.infer<typeof OrderSchema>>({
        defaultValues: mapEntityToForm(preparedOrder),
        resolver: zodResolver(OrderSchema)
    });

    useFormDebug(formContext);

    useEffect(() => {
        dispatch(setCartCheckout(false));
    }, [dispatch]);

    const onSubmit: SubmitHandler<z.infer<typeof OrderSchema>> = (formData: z.infer<typeof OrderSchema>) => {
        setIsEditMode(false);

        const updatedOrder = mapFormToEntity(formData, preparedOrder, member);
        submit(updatedOrder);
    };

    const submit = (order: Order) => {
        submitOrder(
            order,
            `/${lang}/brands/${brandId}/members/${member.uuid}/checkout/${order.uuid}`,
            // Before save
            async (_) => {
            },
            // Success
            (entity) => {
                showResultToast(true, t("action.submitSuccess"));
                dispatch(clearCart());
                router.push(`/${lang}/brands/${brandId}/members/${member.uuid}/checkout/${order.uuid}/confirmation`);

            },
            // Error
            (result) => {
                showResultToast(false, t("action.submitError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    function mapEntityToForm(order: Order): z.infer<typeof OrderSchema> {
        return {
            billingDetail: {
                name: order.billingDetail?.name ?? "",
                email: order.billingDetail?.email ?? "",
                address: order.billingDetail?.address ?? {} as any,
            },
            shippingDetail: {
                address: order.shippingDetail?.address ?? order.billingDetail?.address ?? {} as any,
                shippingMethod: order.shippingDetail?.shippingMethod ?? undefined,
            },
            paymentDetail: {
                financialInstrumentUuid: order.paymentDetail?.financialInstrumentUuid ?? "",
            }
        };
    }

    function mapFormToEntity(formData: z.infer<typeof OrderSchema>, order: Order, member: Member): Order {
        return {
            ...order,
            billingDetail: {
                name: formData.billingDetail.name,
                email: formData.billingDetail.email ?? "",
                address: formData.billingDetail.address,
            },
            shippingDetail: formData.shippingDetail ? {
                ...order.shippingDetail,
	            carrier: order.shippingDetail?.carrier ?? undefined,
                address: formData.shippingDetail.address,
                shippingMethod: formData.shippingDetail.shippingMethod as ShippingMethodEnum,
            } : undefined,
            paymentDetail:  formData.paymentDetail ? {
                ...order.paymentDetail,
                paymentMethod: PaymentMethodEnum.credit,
                financialInstrumentUuid: formData.paymentDetail.financialInstrumentUuid,
            } : undefined
        }
    };

    return (
        <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
            <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                <div className="w-100 h-100">
                    <FormProvider {...formContext}>
                        <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="checkout_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                            <div className="d-flex flex-column align-items-center">
                                <h1 className="text-tertiary">{t("title")}</h1>
                            </div>
                            <hr className="mt-1" />
                            <div className="d-flex flex-column justify-content-start w-100 h-100 overflow-auto">
                                <OrderCheckoutInfo lang={lang} brandId={brandId} order={order} isEditMode={isEditMode} />
                                <CheckoutPaymentMode lang={lang} member={member} order={order} isEditMode={isEditMode}
                                    initialAvailableFinancialInstrumentItems={initialAvailableFinancialInstrumentItems}
                                    preferredFinancialInstrumentUuid={preferredFinancialInstrumentUuid} />
                            </div>
                            <hr className="mt-1 mb-1" />
                            <FormActionCheckoutButtons isSubmitting={isSubmitting} isEditMode={isEditMode} formId="checkout_info_form" />
                        </Form>
                        <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
