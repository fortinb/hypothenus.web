"use client";

import { useOrderActions } from "@/app/lib/hooks/useOrderActions";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import FormActionCheckoutButtons from "@/app/ui/components/actions/form-action-checkout-buttons";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { CheckoutInfo } from "@/app/ui/components/order/checkout-info";
import { Order, OrderSchema } from "@/src/lib/entities/cart/order";
import { Member } from "@/src/lib/entities/member";
import { PaymentOption } from "@/src/lib/entities/payment-option";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { submitOrderAction } from "./actions";
import { ActionResult } from "@/app/lib/http/result";
import { clearCart } from "@/app/lib/store/slices/cart-state-slice";
import { useAppDispatch } from "@/app/lib/hooks/useStore";

export function CheckoutForm({ lang, brandId, member, preparedOrder }:
    {
        lang: string;
        brandId: string;
        member: Member;
        preparedOrder: Order;
    }) {
    const t = useTranslations("checkout");
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [order, setOrder] = useState<Order>(preparedOrder);
    const [billingMember] = useState<Member>(member);

    const [isEditMode, setIsEditMode] = useState<boolean>(true);
    const { isSubmitting, submitOrder } = useOrderActions({
        actions: {
            submitOrder: submitOrderAction,
            createOrder: function (...args: any[]): Promise<ActionResult<Order>> {
                throw new Error("Function not implemented.");
            }
        }
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    const formContext = useForm<z.infer<typeof OrderSchema>>({
        defaultValues: mapEntityToForm(order),
        resolver: zodResolver(OrderSchema)
    });

    useFormDebug(formContext);

    const onSubmit: SubmitHandler<z.infer<typeof OrderSchema>> = (formData: z.infer<typeof OrderSchema>) => {
        setIsEditMode(false);

        const updatedOrder = mapFormToEntity(formData, order, billingMember);
        buyOrder(updatedOrder);
    };

    const buyOrder = (order: Order) => {
        submitOrder(
            order,
            // Before save
            async (_) => {
            },
            // Success
            (entity) => {
                showResultToast(true, t("action.submitSuccess"));
                dispatch(clearCart());
                router.push(`/${lang}/members/${brandId}/memberships/checkout/${order.uuid}/confirmation`);

            },
            // Error
            (result) => {
                showResultToast(false, t("action.submitError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    function mapEntityToForm(order?: Order): z.infer<typeof OrderSchema> {
        return {
            paymentOptionUuid: order?.paymentOption?.uuid ?? "",
            expirationDate: order?.paymentOption?.expirationDate ?? "",
            cvv: order?.paymentOption?.cvv ?? ""
        };
    }

    function mapFormToEntity(formData: z.infer<typeof OrderSchema>, order: Order, member: Member): Order {
        return {
            ...order,
            paymentOption: {
                ...member.paymentOptions?.find(option => option.uuid === formData.paymentOptionUuid) as PaymentOption,
                expirationDate: formData.expirationDate,
                cvv: formData.cvv
            }
        };
    }
    return (
        <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
            <div className="ps-2 pe-2">
                <hr className="mt-0 mb-0" />
            </div>
            <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                <FormProvider {...formContext}>
                    <Form as="form" className="d-flex flex-column align-items-centerjustify-content-between w-100 h-100 p-2" id="member_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                        <div className="d-flex flex-column align-items-center">
                            <h1 className="text-tertiary">{t("checkout.title")}</h1>
                        </div>
                        <hr className="mt-1" />
                        <CheckoutInfo lang={lang} brandId={brandId} order={order} paymentOptions={member.paymentOptions} />
                        <hr className="mt-1 mb-1" />
                        <FormActionCheckoutButtons isSubmitting={isSubmitting} isEditMode={isEditMode} formId="member_info_form" />
                    </Form>

                    <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                </FormProvider>
            </div>
        </div>
    );
}
