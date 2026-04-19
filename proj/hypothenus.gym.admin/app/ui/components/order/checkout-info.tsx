"use client";

import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Controller, useFormContext } from "react-hook-form";
import FormLabelRequired from "@/app/ui/components/forms/form-label-required";
import { Container } from "react-bootstrap";
import { Order } from "@/src/lib/entities/financial/order";
import { OrderInfo } from "./order-info";
import { FinancialInstrument } from "@/src/lib/entities/financial/financial-instrument";
import { IMaskInput } from "react-imask";

export function CheckoutInfo({ lang, brandId, financialInstruments, order }:
	{
		lang: string,
		brandId: string,
		financialInstruments: FinancialInstrument[],
		order: Order
	}) {
	const { register, formState: { errors } } = useFormContext();
	const t = useTranslations("checkout");

	return (
		<fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="checkout_info_form" disabled={false} >
			<Container >
				<Row className="m-2 gx-2">
					<OrderInfo lang={lang} brandId={brandId} order={order} />
				</Row>
				<Row className="m-2 gx-2">
					<Col xs={12}>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("financialInstrument.label")} />
							<Form.Select id="checkout-financial-instruments-dropdown" {...register(`financialInstrumentUuid`)} defaultValue={financialInstruments ? financialInstruments.length > 0 ? financialInstruments.find(option => option.preferred)?.uuid : "" : ""}>
								{financialInstruments?.map((option) => (
									<option key={option.uuid} value={option.uuid}>{option.cardNumber}</option>
								))}
							</Form.Select>
							{errors.financialInstrumentUuid && <Form.Text className="text-invalid">{t(errors.financialInstrumentUuid.message as string)}</Form.Text>}
						</Form.Group>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("financialInstrument.expirationDate.label")} />
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
							<FormLabelRequired className="text-primary" label={t("financialInstrument.cvv.label")} />
							<Controller
								name={`cvv`}
								render={({ field }) => (
									<IMaskInput
										{...field}
										value={field.value != null ? String(field.value) : ""}
										mask="000"
										onAccept={(value) => field.onChange(value)}
										inputRef={field.ref}
										id={"checkout-financial-instrument-cvv"}
										placeholder="cvv"
										className={"form-control" + (errors.cvv ? " input-invalid" : "")}
									/>
								)}
							/>
							{errors.cvv && <Form.Text className="text-invalid">{t(errors.cvv.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
			</Container>
		</fieldset>
	);
}
