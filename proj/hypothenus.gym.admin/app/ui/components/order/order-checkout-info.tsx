"use client";

import { Order, OrderSchema } from "@/src/lib/entities/sale/order";
import { useTranslations } from "next-intl";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useFormContext } from "react-hook-form";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import FormLabelRequired from "../forms/form-label-required";
import { useState } from "react";
import OrderBillingAddressInfo from "./order-billing-address-info";
import OrderShippingAddressInfo from "./order-shipping-address-info";
import { z } from "zod";
import { ShippingMethodEnum } from "@/src/lib/entities/enum/shipping-method-enum";

export function OrderCheckoutInfo({ lang, brandId, order, isEditMode }:
	{
		lang: string,
		brandId: string,
		order: Order,
		isEditMode: boolean
	}) {
	const t = useTranslations("checkout");
	const { register, formState: { errors } } =  useFormContext<z.infer<typeof OrderSchema>>();

	const [accordeonDefaultActiveKeys] = useState<string[]>(["0", "1"]);
	return (
		<fieldset className="d-flex flex-column ms-4 me-4" form="checkout_info_form" disabled={!isEditMode} >
			<Container>
				<div className="d-flex flex-row justify-content-start">
					<h4 className="text-secondary">{t("billingDetail.title")}</h4>
				</div>

				<Row className="gx-2">
					<Col xs={6} >
						<Form.Group>
							<FormLabelRequired className="text-primary" htmlFor="order_billing_detail_name" required={true} label={t("billingDetail.name")}></FormLabelRequired>
							<Form.Control type="input" id="order_billing_detail_name" {...register("billingDetail.name")}
								className={errors?.billingDetail?.name ? "input-invalid" : ""}
							/>
							{errors?.billingDetail?.name && <Form.Text className="text-invalid">{t(errors.billingDetail.name.message as string)}</Form.Text>}
						</Form.Group>
					</Col>

					<Col xs={6} >
						<Form.Group>
							<FormLabelRequired className="text-primary" htmlFor="order_billing_detail_email" required={true} label={t("billingDetail.email")}></FormLabelRequired>
							<Form.Control type="input" id="order_billing_detail_email" {...register("billingDetail.email")}
								className={errors?.billingDetail?.email ? "input-invalid" : ""}
							/>
							{errors?.billingDetail?.email && <Form.Text className="text-invalid">{t(errors.billingDetail.email.message as string)}</Form.Text>}
						</Form.Group>
					</Col>
				</Row>
				<Row className="mt-2 gx-2">
					<Accordion defaultActiveKey={accordeonDefaultActiveKeys} alwaysOpen>
						<Accordion.Item eventKey="0" className="pt-2">
							<Accordion.Header className={(errors?.billingDetail?.address ? "accordeon-header-invalid" : "")}>{t("billingDetail.address.title")}</Accordion.Header>
							<Accordion.Body className="p-0">
								<Row className="m-2 p-2">
									<Col xs={12} className="p-1" >
										<OrderBillingAddressInfo />
									</Col>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
						{(order.shippingDetail?.shippingMethod !== ShippingMethodEnum.email &&
						  order.shippingDetail?.shippingMethod !== ShippingMethodEnum.pickup
						) && (
							<Accordion.Item eventKey="1" className="pt-2">
								<Accordion.Header className={(errors?.shippingDetail?.address ? "accordeon-header-invalid" : "")}>{t("shippingDetail.address.title")}</Accordion.Header>
								<Accordion.Body className="p-0">
									<Row className="m-2 p-2">
										<Col xs={12} className="p-1" >
											<OrderShippingAddressInfo />
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						)}
					</Accordion>
				</Row>
			</Container>
		</fieldset>
	);
}