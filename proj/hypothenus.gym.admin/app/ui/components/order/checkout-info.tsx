"use client";

import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Controller, useFormContext } from "react-hook-form";
import FormLabelRequired from "@/app/ui/components/forms/form-label-required";
import { Container } from "react-bootstrap";
import { Order } from "@/src/lib/entities/cart/order";
import { OrderInfo } from "./order-info";
import { PaymentOption } from "@/src/lib/entities/payment-option";
import { IMaskInput } from "react-imask";

export function CheckoutInfo({ lang, brandId, paymentOptions, order }:
	{
		lang: string,
		brandId: string,
		paymentOptions: PaymentOption[],
		order: Order | null,
	}) {
	const { register, formState: { errors } } = useFormContext();
	const t = useTranslations("checkout");

	return (
		<fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="checkout_info_form" disabled={false} >
			<Container >
				<Row className="m-2 gx-2">
					<div className="d-flex flex-column align-items-center">
						<h1 className="text-tertiary">{t("title")}</h1>
					</div>
					<hr className="mt-1" />
					<OrderInfo lang={lang} brandId={brandId} order={order} />
				</Row>
				<Row className="m-2 gx-2">
					<Col xs={12}>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("paymentOption.label")} />
							<Form.Select id="checkout-payment-options-dropdown" {...register(`paymentOptionUuid`)} defaultValue={paymentOptions ? paymentOptions.length > 0 ? paymentOptions.find(option => option.default)?.uuid : "" : ""}>
								{paymentOptions?.map((option) => (
									<option key={option.uuid} value={option.uuid}>{option.cardNumber}</option>
								))}
							</Form.Select>
							{errors.paymentOptionUuid && <Form.Text className="text-invalid">{t(errors.paymentOptionUuid.message as string)}</Form.Text>}
						</Form.Group>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("paymentOption.expirationDate.label")} />
							<div>
								<Controller
									name={`expirationDate`}
									render={({ field }) => (
										<IMaskInput
											{...field}
											value={field.value != null ? String(field.value) : ""}
											mask="00/00"
											onAccept={(value) => field.onChange(value)}
											inputRef={field.ref}
											id={"checkout-payment-expiration-date"}
											placeholder="mm/aa"
											className={"form-control" + (errors.expirationDate ? " input-invalid" : "")}
										/>
									)}
								/>
							</div>
							{errors.expirationDate && <Form.Text className="text-invalid">{t(errors.expirationDate.message as string)}</Form.Text>}
						</Form.Group>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("paymentOption.ccv.label")} />
							<Controller
								name={`ccv`}
								render={({ field }) => (
									<IMaskInput
										{...field}
										value={field.value != null ? String(field.value) : ""}
										mask="000"
										onAccept={(value) => field.onChange(value)}
										inputRef={field.ref}
										id={"checkout-payment-ccv"}
										placeholder="ccv"
										className={"form-control" + (errors.ccv ? " input-invalid" : "")}
									/>
								)}
							/>
							{errors.ccv && <Form.Text className="text-invalid">{t(errors.ccv.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
			</Container>
		</fieldset>
	);
}
