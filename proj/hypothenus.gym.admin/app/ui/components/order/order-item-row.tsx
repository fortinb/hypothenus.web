"use client";

import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { formatCost } from "@/src/lib/entities/finance/cost";
import { getMembershipPlanName, getMembershipPlanPrice, MembershipPlan } from "@/src/lib/entities/membership-plan";
import { OrderItem } from "@/src/lib/entities/sale/order";
import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function OrderItemRow({ lang, item }:
    {
        lang: string;
        item: OrderItem;
    }) {
    const t = useTranslations("entity");

    function getMembershipPlanBilling(membershipPlan: Partial<MembershipPlan>): string {
        return `${t(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
    }

    return (
            <Row className="gx-2 py-2">
                <Col xs={4} className="d-flex flex-column align-items-start justify-content-start">
                    <span className="text-primary">{getMembershipPlanName(item.membershipPlan, lang as LanguageEnum)}</span>
                </Col>
                <Col xs={2} className="d-flex align-items-center justify-content-end">
                    <span className="card-text-smaller text-primary">{getMembershipPlanPrice(item.membershipPlan, false)}</span>
                </Col>
                <Col xs={3} className="d-flex align-items-center justify-content-start">
                    <span className="card-text-smaller text-primary">{getMembershipPlanBilling(item.membershipPlan)}</span>
                </Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center">
                    <span className="text-primary">{item.quantity}</span>
                </Col>
                <Col xs={2} className="d-flex flex-column align-items-end justify-content-center text-primary">
                    <span >
                        {formatCost(item.itemTotal, false)}
                    </span>
                </Col>
            </Row>
    );
}