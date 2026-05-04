"use client";

import { Member } from "@/src/lib/entities/member";
import { formatPersonName } from "@/src/lib/entities/contact/person";
import { useTranslations } from "next-intl";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AddressDisplay from "../contact/address-display";

export function BillingInfo({ lang, brandId, member }:
	{
		lang: string,
		brandId: string,
		member: Member,
	}) {
	const t = useTranslations("checkout");

	return (
		<div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
			<div className="d-flex flex-row justify-content-center">
				<h2 className="text-secondary pt-4 ps-2">{t("billingInfo.title")}</h2>
			</div>
			<div className="ps-2 pe-2">
				<hr />
			</div>
			<Container fluid={true}>
				<Row className="gx-2">
					<Col xs={12} >
						<div className="d-flex flex-row justify-content-center mb-2">
							<span className="text-primary">{formatPersonName(member.person)} </span>
						</div>
					</Col>
				</Row>
				<Row className="gx-2">
					<Col xs={12} >
						<div className="d-flex flex-row justify-content-center mb-2">
							<span className="text-primary">{member.person.email} {member.person.address.streetName} {member.person.address.appartment !== "" ? `#${member.person.address.appartment}` : ""}</span>
						</div>
						<div className="ps-2 pe-2">
							<hr />
						</div>
					</Col>
				</Row>
				<Row className="gx-2">
					<Col xs={12} >
						<div className="d-flex flex-row justify-content-center mb-2">
							<AddressDisplay address={member.person.address} />
						</div>
					</Col>
				</Row>
			</Container>
		</div>

	);
}
