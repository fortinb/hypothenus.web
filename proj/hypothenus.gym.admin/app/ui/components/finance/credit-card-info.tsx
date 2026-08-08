"use client";

import FormLabelRequired from "@/app/ui/components/forms/form-label-required";
import { CreditCard } from "@/src/lib/entities/finance/financial-instrument";
import { useTranslations } from "next-intl";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Controller, useFormContext } from "react-hook-form";
import { IMaskInput } from "react-imask";

export function CreditCardInfo({ isEditMode }:
	{
		creditCard?: CreditCard,
		isEditMode: boolean
	}) {
	const t = useTranslations("entity");
	const { register, formState: { errors } } = useFormContext();
	return (
		<fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="checkout_info_form" disabled={!isEditMode} >
			<Container >
				<Row className="m-2 gx-2">
					<Col xs={12} >
						<Form.Group>
							<FormLabelRequired className="text-primary" required={true} htmlFor={`creditcard_input_cardNumber`} label={t("financialInstrument.creditCard.cardNumber")} ></FormLabelRequired>
							<Form.Control type="input" id={`creditcard_input_cardNumber`}  {...register(`cardNumber`)}
								className={errors.cardNumber ? "input-invalid" : ""} />
							{errors.cardNumber && <Form.Text className="text-invalid">{t(errors.cardNumber.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
				<Row className="m-2 gx-2">
					<Col xs={12} >
						<Form.Group>
							<FormLabelRequired className="text-primary" required={true} htmlFor={`creditcard_input_cardHolderName`} label={t("financialInstrument.creditCard.cardHolderName")} ></FormLabelRequired>
							<Form.Control type="input" id={`creditcard_input_cardHolderName`}  {...register(`cardHolderName`)}
								className={errors.cardHolderName ? "input-invalid" : ""} />
							{errors.cardHolderName && <Form.Text className="text-invalid">{t(errors.cardHolderName.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
				<Row className="m-2 gx-2">
					<Col xs={6}>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("financialInstrument.creditCard.expirationDate")} />
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
					</Col>
					<Col xs={6}>
						<Form.Group>
							<FormLabelRequired className="text-primary" label={t("financialInstrument.creditCard.cvd")} />
							<Controller
								name={`cvd`}
								render={({ field }) => (
									<IMaskInput
										{...field}
										value={field.value != null ? String(field.value) : ""}
										mask="000"
										onAccept={(value) => field.onChange(value)}
										inputRef={field.ref}
										id={"checkout-financial-instrument-cvd"}
										placeholder="cvd"
										className={"form-control" + (errors.cvd ? " input-invalid" : "")}
									/>
								)}
							/>
							{errors.cvd && <Form.Text className="text-invalid">{t(errors.cvd.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
				<Row className="m-2 gx-2">
						<Col xs={6} >
							<Form.Group>
								<FormLabelRequired className="text-primary" required={true} htmlFor={`creditcard_input_zipcode`} label={t("financialInstrument.creditCard.zipCode")} ></FormLabelRequired>
								<Form.Control type="input" id={`creditcard_input_zipcode`}  {...register(`zipCode`)}
									className={errors.zipCode ? "input-invalid" : ""} />
								{errors.zipCode && <Form.Text className="text-invalid">{t(errors.zipCode.message as string)}</Form.Text>}
							</Form.Group>
						</Col>
						<Col xs={6}></Col>
					</Row>
			</Container>
		</fieldset>
	);
}
